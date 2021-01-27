
# -*- coding: utf-8 -*-
from login import *
from browser import *
import time
from logger import getlog
import argparse

# create a logger 
logger = getlog("auto_click")


# 等待页面加载
def loading(selector, driver):
    print(find_element(selector, driver).text)
    try:
        WebDriverWait(driver, 10).until(ec.visibility_of_element_located(locator(selector, driver)))
        logger.info("The loading begins")
        WebDriverWait(driver, 10).until(ec.invisibility_of_element_located(locator(selector, driver)))
    except Exception as e:
        logger.error("Failed to wait the element with %s" % e)


#  强制等待
def sleep(seconds):
    time.sleep(seconds)
    logger.info("Sleep for %d seconds" % seconds)


def auto_click(browser, url, username_selector, password_selector, login_selector, username, password):
    driver = open_browser(browser, url)
    url = driver.current_url
    if 'login' in url:
        type(username_selector, driver, username)
        type(password_selector, driver, password)
        click(login_selector, driver)

    menus = driver.find_elements_by_xpath('//*[(@class="fst" or @class="fst selected" or @class="fst deployed") and starts-with(@id,"menu-")]')
    tabs = driver.find_elements_by_xpath('//*[(@class="sec" or @class="sec selected" or @class="sec deployed") and starts-with(@tab-id,"tab-")]')
    navs = driver.find_elements_by_xpath('//*[(@class="nav")]')

    loading("c=>loading-waiting-icon", driver)	
    for menu in menus:
        print(menu.text)
        menu.click()
        for tab in tabs:
            if tab.is_displayed():
                print(tab.text)
                tab.click()
                loading("c=>loading-waiting-icon", driver)  # 等待加载结束
                for nav in navs:
                    if nav.is_displayed():
                        print(nav.text),
                        print("click start")
                        nav.click()
                        print(nav.text), 
                        print("click end")
                        loading("c=>loading-waiting-icon", driver)  # 等待加载结束

    quit_browser(driver)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-b", "--browser_type", help="the type of browser", type=str, default="Firefox")
    parser.add_argument("-u", "--url", help="the url of device",  type=str, default="http://192.168.1.1/")
    parser.add_argument("-a", "--username_box", help="the selector of username_box",  type=str, default="i=>login-username")
    parser.add_argument("-p", "--password_box", help="the selector of password_box",  type=str, default="x=>//*[@id='form-login']/div[2]/div/div/div[1]/span/input[1]")
    parser.add_argument("-l", "--login", help="the id_selector of login-botton",  type=str, default="i=>login-btn")
    parser.add_argument("-un", "--username", help="the text of username",  type=str, default="Admin123")
    parser.add_argument("-pw", "--password", help="the text of password",  type=str, default="Admin123")
    
    args = parser.parse_args()
    start = time.time()
    auto_click(args.browser_type, args.url, args.username_box, args.password_box, args.login, args.username, args.password)
    end = time.time()
    print("\nauto_click test in %f s\n" %(end-start))
