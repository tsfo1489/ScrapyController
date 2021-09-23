import json

def readJson(name):
    result = []
    base = "scrapy crawl"
    with open(name,'r') as file:
        json_data = json.load(file)
    data = json.dumps(json_data)
    print("data", data)
    for crawler in json_data:
        base =base + " " + crawler["name"]
        addArgs= ""
        addOptions = ""
        parameters = crawler["parameters"]
        for arg in parameters:
            addArgs = addArgs + " -a "+ arg +"="+parameters[arg]
        options = crawler["options"]
        for opt in options :
            ## 일단은 LOGFILE에 관한 옵션만 진행
            addOptions = addOptions + " -s "+opt+"="+options[opt]
        print("base: ", base)
        print("Args: ", addArgs)
        print("Opts: ", addOptions)
        print(base + addArgs + addOptions)
        result.append(base + addArgs + addOptions)
    return result

def main():
    jsonFileName = "../docs/sample_Input.json"
    para = readJson(jsonFileName)
    print("para: ", para)

if __name__ == '__main__':
    main()