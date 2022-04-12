import os

PATH = "./GUI_images/"

def parse_string(filename: str) -> str:
	filename_list = list(filename)
	for i in range(len(filename_list)):
		if filename_list[i] == " ":
			filename_list[i] = "-"
	return ''.join(filename_list)

# Listing subtree
entries = os.listdir(PATH) 
for directory in entries:
	path_tmp = PATH + directory + "/"
	images = os.listdir(path_tmp)
	for item in images:
		if item != ".DS_Store":
			item = parse_string(item)
			print(f"![{item}]({path_tmp}{item})")


