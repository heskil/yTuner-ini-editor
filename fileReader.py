# fileReader.py
import json
import string
from collections import defaultdict

# default value for path to stations.ini
iniPath = "/home/amelie/Downloads/stations.ini"
# file structure that keeps track of categories and channels
values=defaultdict(list)


# TODO endpoint for setting new ini file path, maybe with file open dialog!!!

def getValues():
    # Return the content
    return json.dumps(values)

def setPath(self,newPath):
    self.iniPath = newPath

def readIni() :
    # Open the file in read mode
    file = open(iniPath, "r")
    # Read the entire content of the file
    content = file.read()
    # Remove unnecessary spaces
    content = content.strip()
    # Splits values into list
    list = content.split()
    # Close the file
    file.close()

    currCat = ""
    for val in list:
        if (val[0] == "[" and val[len(val)-1] == "]") :
            # Initialize dict entry for category
            currCat = val[1:len(val)-1]
            values[currCat] = []
        else:
            # Split val into channel and channel url
            split = val.split("=")
            # Add value to category
            values[currCat].append(split)

# Adds a category or edits an existing one
def addCategory(category,newCategory):
    if newCategory == "" and not(category in values):
        # Adds new category
        values[category] = []
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
    if category in values:
        values.pop(category)
        return True
    else:
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
        out = out + ("[" + cat + "]\n")
        for channelAndUrl in values[cat]:
            if len(channelAndUrl) == 2:
                out = out + (channelAndUrl[0] + "=" + channelAndUrl[1] + "\n")
        out = out + "\n"
    with open(iniPath, "w") as f:
        f.write(out)
    return True