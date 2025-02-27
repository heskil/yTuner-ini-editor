# app.py

from flask import Flask, render_template, request, jsonify # type: ignore
import fileReader # type: ignore

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/refresh", methods=['GET'])
def refresh():
    try:
        fileReader.readIni()
        return "Successfully refreshed values", 200
    except FileNotFoundError:
        return "Stations file could not be found under this path", 500

@app.route("/getValues", methods=['GET'])
def getValues():
    return fileReader.getValues(), 200

@app.route("/setPath", methods=["POST"])
def setPath():
    # takes json with path as key
    json = request.get_json()
    try:
        fileReader.setPath(fileReader,json["path"])
        return "Path set successfully to " + json["path"], 200
    except FileNotFoundError:
        return "No ini found under this path", 400
    

# adds a category, or renames an existing one
@app.route("/addCategory", methods=["POST"])
def addCategory():
    json = request.get_json()
    category = ""
    newCategory = ""
    try:
        category = json["category"]
    except KeyError:
        return "Missing value for category", 400
    
    # optional value for renaming a category
    try:
        newCategory = json["newCategory"]
    except KeyError:
        print("adding new category, not renaming existing one")
    
    out = fileReader.addCategory(category,newCategory)
    if out:
        return "Added or edited category", 200
    else:
        return "Attempted to edit a category that doesn't exist or create an existing one", 400
    
# removes a category
@app.route("/deleteCategory", methods=["POST"])
def deleteCategory():
    json = request.get_json()
    category = ""
    try:
        category = json["category"]
    except KeyError:
        return "Missing value for category", 400
    
    out = fileReader.deleteCategory(category)
    if out:
        return "Deleted category", 200
    else:
        return "Category does not exist and could not be deleted", 400
    
# adds a channel and url
@app.route("/addChannelURL", methods=["POST"])
def addChannelAndURL():
    json = request.get_json()
    jsonKey= "category" # for return value, keeps track of which json parameter is being accessed
    category = ""
    channel = ""
    url = ""
    try:
        category = json["category"]
        jsonKey = "channel"
        channel = json["channel"]
        jsonKey = "url"
        url = json["url"]
    except KeyError:
        return "Missing value for " + jsonKey, 400
    
    out = fileReader.addChannelAndURL(category,channel,url)
    if out:
        return "Added channel and url", 200
    else:
        return "Category does not exist or channel already does. Channel and url could not be added", 400

# edits the channel and url values
@app.route("/editChannelURL", methods=["POST"])
def editChannelURL():
    json = request.get_json()
    jsonKey= "category" # for return value, keeps track of which json parameter is being accessed
    category = ""
    channel = ""
    newChannel = ""
    newUrl = ""
    try:
        category = json["category"]
        jsonKey = "channel"
        channel = json["channel"]
    except KeyError:
        return "Missing value for " + jsonKey, 400
    
    # optional value for renaming a channel or url
    try:
        newChannel = json["newChannel"]
        newUrl = json["newUrl"]
    except KeyError:
        print("one or both values for editing channel and url were empty")
    
    out = fileReader.editChannelAndURL(category,channel,newChannel,newUrl)
    if out:
        return "Edited channel and url", 200
    else:
        return "Category or channel in category does not exist. Channel and url could not be edited", 400
    
# deletes the channel and url value
@app.route("/deleteChannel", methods=["POST"])
def deleteChannelURL():
    json = request.get_json()
    jsonKey= "category" # for return value, keeps track of which json parameter is being accessed
    category = ""
    channel = ""
    try:
        category = json["category"]
        jsonKey = "channel"
        channel = json["channel"]
    except KeyError:
        return "Missing value for " + jsonKey, 400
    
    out = fileReader.deleteChannelAndUrl(category,channel)
    if out:
        return "Deleted channel and url", 200
    else:
        return "Could not delete channel and url", 400
    
@app.route("/writeFile", methods=["POST"])
def writeFile():
    try:
        fileReader.writeToFile()
        return "Wrote values to file", 200
    except:
        return "Could not write to file", 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
