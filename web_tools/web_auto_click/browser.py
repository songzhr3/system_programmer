# -*- coding: utf-8 -*-
import os.path
from selenium import webdriver
from logger import getlog

logger = getlog("browser")

def open_browser(browser, url):
    dir = os.path.split(os.path.realpath(__file__))[0]
    driver_path = dir + '/driver'
    
    logger.info("You had select %s browser." % browser)
    logger.info("The test server url is: %s" % url)
    if browser == "Firefox":  # 判断浏览器类型
        driver = webdriver.Firefox()
        logger.info("Starting firefox browser.")
    elif browser == "Chrome":
        driver = webdriver.Chrome()
        logger.info("Starting Chrome browser.")
    elif browser == "IE":
        driver = webdriver.Ie()
        logger.info("Starting IE browser.")

    driver.get(url)  # 打开浏览器，输入URL
    logger.info("Open url: %s" % url)
    driver.maximize_window()  # 窗口最大化
    logger.info("Maximize the current window.")
    driver.implicitly_wait(10)  # 隐式等待10秒
    logger.info("Set implicitly wait 10 seconds.")
    return driver

def quit_browser(driver):
    logger.info("Now, Close and quit the browser.")
    driver.quit()
