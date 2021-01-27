# -*- coding: utf-8 -*-
import re
import os 
import json
import argparse
import tarfile
import collections

## 解压web.tar资源包
def un_tar(tar_path):
       # untar zip file"""
    tar = tarfile.open(tar_path)
    names = tar.getnames()
    target_path = os.getcwd()
    # print(target_path)
    if os.path.isdir(target_path):
        pass
    else:
        os.mkdir(target_path)
    #因为解压后是很多文件，预先建立同名目录
    for name in names:
        tar.extract(name, target_path)
    tar.close()
    print("untar web.tar done")


def get_merge_json(json_path):
    result_dict = {}
    with open(json_path, "r") as file:
        lines = file.readlines()
        key_index = 0
        while key_index < len(lines) - 1:
            key = lines[key_index][:-1]
            key_sort = list(key)
            key_sort.sort()
            key = "".join(key_sort).strip()
            pattern = re.compile('"', re.DOTALL)
            key = pattern.sub("", key)

            value = lines[key_index+1][:-1]
            value = json.loads(value)

            if key and key not in result_dict:
                result_dict[key] = value

            key_index += 2

            ## another sort method
            # key = json.loads(key) # dict
            # key_sort = sorted(key)
            # key_dict = collections.OrderedDict()
            # for item in key_sort:
            #     key_dict[item] = key[item]
            # key = json.dumps(key_dict, separators=(',',':'))
            # key = json.dumps(key, sort_keys = True)
            # print(key)

            # if (key[0] != "{" or key[-1] != "}" or value[0] != "{" or value[-1] != "}"):
            #     print("error in json_data %d line"%i)

    result_json = json.dump(result_dict, open(json_path, "w"), separators=(',',':'))
    # print(result_json)
    # with open(json_path, "w") as file:
    #     file.write(result_json)
    
    print("get_json_data done")
            

def process_html(userrpm_path):
    userrpm_list = os.listdir(userrpm_path)
    for filename in userrpm_list:
        htm_path = userrpm_path + '/' + filename
        with open(htm_path, "r") as file:
            userrpm_htm = file.read()

        pattern = re.compile('^(<%.*?%>)[\s]+', re.DOTALL)
        result = pattern.sub("", userrpm_htm, 1)

        web_static_pattern = re.compile('"/web-static')
        result = web_static_pattern.sub('"../web-static', result)
        
        result = result.replace("'/web-static", "'../web-static").replace('\r', '')
        result = result.replace("'web-static", "'../web-static").replace('\r', '')
        result = result.replace('"web-static', '"../web-static').replace('\r', '')

        result = result.replace('<%=build_year%>', "''").replace('\r', '')

        with open(htm_path, "w") as file:
            file.write(result)
    print("preprocess_htm done")


def process_index_htm(index_path, model_name):
    with open(index_path, "r") as file:
        index_htm = file.read()

    lua_pattern = re.compile('^(<%.*?%>)[\s]+', re.DOTALL)
    no_token_pattern = re.compile('(if[\s]\(!localStorage).*?\}', re.DOTALL)
    get_token_pattern = re.compile('\$\.su\.url\.stok[\s]=.*?\}', re.DOTALL)
    model_pattern = re.compile('<%=model%>')
    web_pattern = re.compile('(window\.sessionsTimeProxy).*?(getSessionsExceedTime\(\);)', re.DOTALL)

    result = lua_pattern.sub("", index_htm, 1)
    result = no_token_pattern.sub("", result, 1)
    result = get_token_pattern.sub("", result, 1)
    result = model_pattern.sub(model_name, result, 1)
    result = web_pattern.sub("", result, 1)

    with open(index_path, "w") as file:
        file.write(result)

    print("process_index_htm done")

def change_ds_url(locale_js_path):
    with open(locale_js_path, "r") as file:
        locale_js = file.read()

    pattern = re.compile('/ds')
    result = pattern.sub("/json_data.json", locale_js, 1)
    sub_old_string = "/stok="
    sub_new_string = "."
    result = result.replace(sub_old_string, sub_new_string).replace('\r', '')

    with open(locale_js_path, "w") as file:
        file.write(result)
    
    print("change_ds_url done")


def change_proxy_method(proxy_js_path):
    with open(proxy_js_path, "r") as file:
        proxy_js = file.read()
    
    pattern = re.compile('POST')
    result = pattern.sub("GET", proxy_js, 1)

    request_old_string = 'if (!me.authSessionsDataFlag'
    request_new_string = ('data = data.replace(/null/g, "[]").replace(/{}/g, "[]")' +
    '\n\tvar request_data = Array.from(data).sort().join("").replace(/"/g,"")' + 
    '\n' +
    '\n\tif (!me.authSessionsDataFlag')
    result = result.replace(request_old_string, request_new_string).replace('\r', '')

    response_old_string = 'if (data.error_code == 0)'
    response_new_string = ('data = data[request_data]' +
    '\n' + 
    '\n\t\t\t\tif (data.error_code == 0)')
    result = result.replace(response_old_string, response_new_string).replace('\r', '')

    with open(proxy_js_path, "w") as file:
        file.write(result)

    print("change_proxy_method done")


def change_jquery_min(origin_jquery_min_path, available_jquery_min_path):
    available_file = available_jquery_min_path + '/' + 'jquery.min.js'
    cmd = "cp -rf " +  available_file + " " + origin_jquery_min_path
    result = os.system(cmd)
    if result == 0:
        print("change_jquery_min done")
    else:
        print("change_jquery_min error")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-t", "--tar_path", help="the path of web.tar", type=str, default="./web.tar")
    parser.add_argument("-j", "--json_path", help="the path of json data", type=str, default="./web/stok=/json_data.json")
    parser.add_argument("-u", "--userrpm_path", help="the path of html of userrpm",  type=str, default="./web/stok=/userrpm")
    parser.add_argument("-i", "--index_path", help="the path of index.htm",  type=str, default="./web/stok=/Index.htm")
    parser.add_argument("-m", "--model_name", help="model name",  type=str, default="TL-FW6600")
    parser.add_argument("-l", "--locale_js_path", help="the path of locale.js",  type=str, default="./web/web-static/js/su/locale.js")
    parser.add_argument("-p", "--proxy_js_path", help="the path of proxy.js",  type=str, default="./web/web-static/js/su/data/proxy.js")
    parser.add_argument("-o", "--origin_jquery_min_path", help="the path of original jquery.min.js",  type=str, default="./web/web-static/js/libs")
    parser.add_argument("-a", "--available_jquery_min_path", help="the path of available jquery.min.js",  type=str, default=".")
    args = parser.parse_args()

    un_tar(args.tar_path)
    get_merge_json(args.json_path)
    process_html(args.userrpm_path)
    process_index_htm(args.index_path, args.model_name)
    change_ds_url(args.locale_js_path)
    change_proxy_method(args.proxy_js_path)
    change_jquery_min(args.origin_jquery_min_path, args.available_jquery_min_path)