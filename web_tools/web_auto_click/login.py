# -*- coding:utf-8 -*-
import time
from selenium.common.exceptions import NoSuchElementException
import os.path
from logger import getlog
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common import exceptions as ex
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec

# create a logger 
logger = getlog("login")

# 定位元素方法
def find_element(selector, driver):
    """
        这个地方为什么是根据=>来切割字符串，请看页面里定位元素的方法
        submit_btn = "id=>su"
        login_lnk = "xpath => //*[@id='u1']/a[7]"  # 百度首页登录链接定位
        如果采用等号，结果很多xpath表达式中包含一个=，这样会造成切割不准确，影响元素定位
    :param selector:
    :return: element
    """
    element = ''
    if '=>' not in selector:
        return driver.find_element_by_id(selector)
    selector_by = selector.split('=>')[0]
    selector_value = selector.split('=>')[1]

    if selector_by == "i" or selector_by == 'id':
        try:
            element = driver.find_element_by_id(selector_value)
            logger.info("Had find the element \' %s \' successful "
                        "by %s via value: %s " % (element.text, selector_by, selector_value))
        except NoSuchElementException as e:
            logger.error("NoSuchElementException: %s" % e)
           
    elif selector_by == "n" or selector_by == 'name':
        element = driver.find_element_by_name(selector_value)
    elif selector_by == "c" or selector_by == 'class_name':
        element = driver.find_element_by_class_name(selector_value)
    elif selector_by == "l" or selector_by == 'link_text':
        element = driver.find_element_by_link_text(selector_value)
    elif selector_by == "p" or selector_by == 'partial_link_text':
        element = driver.find_element_by_partial_link_text(selector_value)
    elif selector_by == "t" or selector_by == 'tag_name':
        element = driver.find_element_by_tag_name(selector_value)
    elif selector_by == "x" or selector_by == 'xpath':
        try:
            element = driver.find_element_by_xpath(selector_value)
            logger.info("Had find the element \' %s \' successful "
                        "by %s via value: %s " % (element.text, selector_by, selector_value))
        except NoSuchElementException as e:
            logger.error("NoSuchElementException: %s" % e)

    elif selector_by == "s" or selector_by == 'selector_selector':
        element = driver.find_element_by_css_selector(selector_value)
    else:
        raise NameError("Please enter a valid type of targeting elements.")

    return element


# 输入
def type(selector, driver, text):
    el = find_element(selector, driver)
    logger.info(el)
    el.clear()
    try:
        el.send_keys(text)
        logger.info("Had type \' %s \' in inputBox" % text)
    except NameError as e:
        logger.error("Failed to type in input box with %s" % e)
        

# 清除文本框
def clear(selector, driver):

    el = find_element(selector, driver)
    try:
        el.clear()
        logger.info("Clear text in input box before typing.")
    except NameError as e:
        logger.error("Failed to clear in input box with %s" % e)


# 切换成expected_conditions里面用的locator
def locator(selector, driver):
    """
        导入的模块里面用的是locator的格式，比我们的格式复杂一点，所以切换一下，不用另写locator
    """
    # element = ''
    if '=>' not in selector:
        return driver.find_element_by_id(selector)
    selector_by = selector.split('=>')[0]
    selector_value = selector.split('=>')[1]
    if selector_by == "i" or selector_by == 'id':
        selector_by = 'id'
    elif selector_by == "n" or selector_by == 'name':
        selector_by = 'name'
    elif selector_by == "c" or selector_by == 'class_name':
        selector_by = 'class name'
    elif selector_by == "l" or selector_by == 'link_text':
        selector_by = 'link text'
    elif selector_by == "p" or selector_by == 'partial_link_text':
        selector_by = 'partial link text'
    elif selector_by == "t" or selector_by == 'tag_name':
        selector_by = 'tag name'
    elif selector_by == "x" or selector_by == 'xpath':
        selector_by = 'xpath'
    elif selector_by == "s" or selector_by == 'selector_selector':
        selector_by = 'selector selector'
    else:
        raise NameError("Please enter a valid type of targeting elements.")
    locator = (selector_by, selector_value)
    return locator

# 点击元素
def click(selector, driver):

    # el = find_element(selector)
    try:
        WebDriverWait(driver, 10).until(ec.element_to_be_clickable(locator(selector, driver)))        # 显式等待
        el = find_element(selector, driver)
        # driver.execute_script("arguments[0].click();", el)
        webdriver.ActionChains(driver).move_to_element(el).click(el).perform()
        # el.click()
        logger.info("The element \' %s \' was clicked." % el.text)
    except NameError as e:
        logger.error("Failed to click the element with %s" % e)


