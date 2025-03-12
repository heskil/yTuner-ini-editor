# fileReader.py
import json
from pathlib import Path
from collections import defaultdict

# default value for path to stations.ini
# TODO change path!
iniPath = "/home/amelie/Downloads/stations.ini"
# file structure that keeps track of categories and channels
values=defaultdict(list)

def getPath():
    return iniPath

def getValues():
    # Return the content
    print("[py] values is")
    print(values)
    print("[py] jsonified values is ")
    print(json.dumps(values))
    print("[py] end of json.dumps")
    return json.dumps(values)

def setPath(self,newPath):
    path = Path(newPath)
    file = open(path, "r")
    file.close()
    self.iniPath = path

def readIni() :
    # Open the file in read mode
    file = open(iniPath, "r")
    # Read the entire content of the file
    content = file.read()
    # Remove unnecessary spaces
    content = content.strip()
    # Splits values into list
    valList = content.split()
    # Close the file
    file.close()

    values.clear()
    currCat = ""
    for val in valList:
        print("[py] reading ini")
        print("[py] val is " + val)
        if (val[0] == "[" and val[len(val)-1] == "]") :
            # Initialize dict entry for category
            print("[py] read category from file")
            currCat = val[1:len(val)-1]
            # * is placeholder value for spaces
            #currCat = currCat.replace("*"," ")
            print("[py] new cat will be " + currCat)
            values[currCat] = []
            print("[py] values should now have the cat, look:")
            print("[py] " + str(values))
        else:
            print("[py] read values from file")
            # * is placeholder value for spaces
            #val = val.replace("*"," ")
            # Split val into channel and channel url
            split = val.split("=")
            # Add value to category
            values[currCat].append(split)

# Adds a category or edits an existing one
def addCategory(category,newCategory):
    if newCategory == "" and not(category in values):
        # Adds new category
        values[category] = []
        print("[py] adding category " + category)
        print("[py] values is now")
        print(values)
        print("[py] end of values")
        return True
    elif newCategory != "" and category in values:
        # Renames an existing category
        values[newCategory] = values[category]
        values.pop(category)
        return True
    else:
        # Attempts to set a new value for a category that doesn't exist
        return False

# Deletes an existing category    
def deleteCategory(category):
    print("[py] deleting category " + category)
    if category in values:
        values.pop(category)
        print("[py] deleted category " + category)
        return True
    else:
        print("[py] " + category + "was not in values as category")
        return False
    
# Adds a channel and URL to a category
def addChannelAndURL(category,channel,url):
    if category in values:
        # Add value to category
        if values[category] != [] and (channel in [item[0] for item in values[category]]):
            # Category already has this channel
            return False
        else:
            values[category].append([channel,url])
            return True
    else:
        return False
    
def deleteChannelAndUrl(category,channel):
    if category in values:
        index = 0
        for item in values[category]:
            if item[0] == channel:
                # deleting channel and url
                values[category].remove(item)
                return True
            index = index + 1
        # only triggers when channel not found in category
        return False
    else:
        # category does not exist
        return False

def editChannelAndURL(category,channel,channelNew,urlNew):
    if category in values:
        # setting new URL is optional, channel and category must be present to identify value
        for item in values[category]:

            if item[0] == channel:
                if channelNew != "":
                    item[0] = channelNew
                if urlNew != "":
                    item[1] = urlNew
                return True
            # only triggers when channel not found in category
            return False
        else:
            # channel that was supposed to be updated does not exist
            return False

# writes new ini file from values
def writeToFile():
    out = ""
    for cat in values:
        print("[py] writing to file")
        print("[py]     written is " + "[" + cat + "]")
        print("[py] values in printing method is " + str(values))
        out = out + ("[" + cat + "]\n")
        for channelAndUrl in values[cat]:
            print("[py] channel and url is " + str(channelAndUrl))
            if len(channelAndUrl) == 2:
                out = out + (channelAndUrl[0] + "=" + channelAndUrl[1] + "\n")
        out = out + "\n"
    with open(iniPath, "w") as f:
        f.write(out)
    return True