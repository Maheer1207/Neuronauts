#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
## Version history:

2018:
	Original script by Dr. Luis Manso [lmanso], Aston University
	
2019, June:
	Revised, commented and updated by Dr. Felipe Campelo [fcampelo], Aston University
	(f.campelo@aston.ac.uk / fcampelo@gmail.com)
"""

import sys
import numpy as np
from EEG_feature_extraction import generate_feature_vectors_from_samples


def gen_matrix(file_path, output_file, cols_to_ignore, training=True):
	"""
	Reads the specified CSV file and assembles the training matrix with 
	the features extracted using the functions from EEG_feature_extraction.
	
	Parameters:
		file_path (str): path to the CSV file to process.
		output_file (str): filename for the output file.
		cols_to_ignore (list): list of columns to ignore from the CSV.

	Returns:
		None
	
	Author: 
		Original: [lmanso] 
		Updates and documentation: [fcampelo]
	"""
	
	# Parse file name
	try:
		filename = file_path.split('/')[-1]
		if (training):
			name, state, _ = filename[:-4].split('_')
		else: state = None
	except:
		print('Wrong file name !', file_path)
		sys.exit(-1)

	if (training):
		print(state)
		if state.lower() == 'concentrating':
			state = 2.0
		elif state.lower() == 'neutral':
			state = 1.0
		elif state.lower() == 'relaxed':
			state = 0.0
		else:
			print('Wrong file name', file_path)
			sys.exit(-1)
		
	print('Using file', file_path)
	
	# Generate feature vectors
	vectors, header = generate_feature_vectors_from_samples(file_path=file_path, 
														    nsamples=150, 
															period=1.0,
															state=state,
														    remove_redundant=False,
															cols_to_ignore=cols_to_ignore)
		
	print('Resulting vector shape for the file', vectors.shape)
	header += ["magic"]

	# Shuffle rows
	np.random.shuffle(vectors)
	
	# Save to file
	np.savetxt(output_file, vectors, delimiter=',',
			   header=','.join(header), 
			   comments='')

	return None


# if __name__ == '__main__':
# 	"""
# 	Main function. The parameters for the script are the following:
# 		[1] file_path: The path to the CSV file to process.
# 		[2] output_file: The filename of the generated output file.
	
# 	ATTENTION: It will ignore the last column of the CSV file. 
	
# 	Author:
# 		Original by [lmanso]
# 		Documentation: [fcampelo]
# 	"""

# 	file_path = '/Users/Mira/Dev/Hackathons/NATHacks24/Neuronauts/backend/Output/1/eeg_concentrating_1.csv'
# 	output_file = '/Users/Mira/Dev/Hackathons/NATHacks24/Neuronauts/backend/Output/1/eeg_concentrating_1_output.csv'
# 	gen_matrix(file_path, output_file, cols_to_ignore=-1, training=False)
