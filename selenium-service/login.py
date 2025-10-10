import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException

class PhilGEPSLogin:
    def __init__(self, headless=False):
        self.base_url = "https://notices.philgeps.gov.ph/"
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(2)
        self.wait = WebDriverWait(self.driver, 15)
        self.short_wait = WebDriverWait(self.driver, 3)

    def close_popup_if_present(self):
        popup_selectors = [
            "//button[text()='Close' and @data-dismiss='modal']",
            "//button[@class='close']",
            "//button[contains(@class, 'btn-close')]",
            ".modal .close",
            "[data-dismiss='modal']"
        ]
        
        for selector in popup_selectors:
            try:
                by = By.XPATH if selector.startswith("//") else By.CSS_SELECTOR
                close_btn = self.short_wait.until(EC.element_to_be_clickable((by, selector)))
                if close_btn.is_displayed():
                    self.driver.execute_script("arguments[0].click();", close_btn)
                    time.sleep(1)
                    return True
            except (TimeoutException, NoSuchElementException):
                continue
        return False

    def wait_for_page_load(self, timeout=10):
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            time.sleep(1)
            return True
        except TimeoutException:
            return False

    def force_click_dropdown(self):
        methods = [
            lambda: self.driver.find_element(By.ID, "dropdownMenuLink").click(),
            lambda: self.driver.execute_script("arguments[0].click();", self.driver.find_element(By.ID, "dropdownMenuLink")),
            lambda: ActionChains(self.driver).click(self.driver.find_element(By.ID, "dropdownMenuLink")).perform()
        ]
        
        for method in methods:
            try:
                method()
                time.sleep(2)
                dropdown = self.driver.find_element(By.ID, "dropdownMenuLink")
                if dropdown.get_attribute("aria-expanded") == "true":
                    return True
            except Exception:
                continue
        return False

    def force_click_supplier_login(self):
        time.sleep(1)
        
        methods = [
            lambda: self.driver.find_element(By.CSS_SELECTOR, 'a.dropdown-item[href="homeMPhilGEPS.html"]'),
            lambda: self.driver.find_element(By.CSS_SELECTOR, 'a[href*="homeMPhilGEPS.html"]'),
            lambda: self.driver.find_element(By.XPATH, "//a[contains(text(), 'Login as Supplier')]")
        ]
        
        for method in methods:
            try:
                element = method()
                if element and element.is_displayed():
                    click_methods = [
                        lambda: element.click(),
                        lambda: self.driver.execute_script("arguments[0].click();", element),
                        lambda: ActionChains(self.driver).move_to_element(element).click().perform()
                    ]
                    
                    for click_func in click_methods:
                        try:
                            click_func()
                            time.sleep(3)
                            current_url = self.driver.current_url
                            if "login" in current_url.lower() or current_url != self.base_url:
                                return True
                        except Exception:
                            continue
            except Exception:
                continue
        return False

    def switch_to_latest_tab(self, wait_for_new=False, timeout=5):
        try:
            if wait_for_new:
                try:
                    WebDriverWait(self.driver, timeout).until(lambda d: len(d.window_handles) > 1)
                except TimeoutException:
                    pass

            handles = self.driver.window_handles
            if len(handles) > 1:
                self.driver.switch_to.window(handles[-1])
                time.sleep(0.5)
                return True
            return False
        except Exception:
            return False

    def prepare_login_context(self, timeout=10):
        candidate_locators = [
            (By.CSS_SELECTOR, "#txtUserName"),
            (By.CSS_SELECTOR, "input[name='txtUserName']"),
            (By.XPATH, "//input[contains(translate(@id, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'user')]")
        ]

        for by, sel in candidate_locators:
            try:
                self.short_wait.until(EC.presence_of_element_located((by, sel)))
                return True
            except TimeoutException:
                continue

        iframes = self.driver.find_elements(By.TAG_NAME, "iframe")
        for frame in iframes:
            try:
                self.driver.switch_to.frame(frame)
                for by, sel in candidate_locators:
                    try:
                        self.short_wait.until(EC.presence_of_element_located((by, sel)))
                        return True
                    except TimeoutException:
                        continue
            except Exception:
                pass
            finally:
                self.driver.switch_to.default_content()
        return False

    def click_intermediate_bottom_button(self):
        try:
            time.sleep(1)
            target_xpath = "/html/body/div/div[2]/a[1]"
            element = self.wait.until(EC.presence_of_element_located((By.XPATH, target_xpath)))
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            time.sleep(0.5)
            
            try:
                clickable = self.wait.until(EC.element_to_be_clickable((By.XPATH, target_xpath)))
                clickable.click()
            except (ElementClickInterceptedException, TimeoutException):
                self.driver.execute_script("arguments[0].click();", element)
            
            time.sleep(1.5)
            self.wait_for_page_load()
            self.switch_to_latest_tab(wait_for_new=True, timeout=5)
            return True
        except TimeoutException:
            return False
        except Exception:
            return False

    def find_in_context(self, find_fn):
        self.driver.switch_to.default_content()
        try:
            return find_fn()
        except Exception:
            pass
        
        frames = self.driver.find_elements(By.TAG_NAME, "iframe")
        for frame in frames:
            try:
                self.driver.switch_to.default_content()
                self.driver.switch_to.frame(frame)
                return find_fn()
            except Exception:
                continue
        
        self.driver.switch_to.default_content()
        raise NoSuchElementException("Element not found")

    def process_single_result(self, result_link):
        try:
            result_link.click()
            time.sleep(2)
            self.wait_for_page_load()

            def find_order_link():
                return self.wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//a[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'order')]")
                ))
            
            order_link = self.find_in_context(find_order_link)
            order_link.click()
            time.sleep(2)
            self.wait_for_page_load()

            def find_title_row_link():
                return self.wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//div[contains(@class,'x-grid3-cell-inner')]//a | //td//a")
                ))
            
            title_link = self.find_in_context(find_title_row_link)
            title_link.click()
            time.sleep(2)
            self.wait_for_page_load()

            def find_continue_btn():
                return self.wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'continue')] | //input[@value='Continue'] | //a[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'continue')]")
                ))
            
            continue_btn = self.find_in_context(find_continue_btn)
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", continue_btn)
            try:
                continue_btn.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", continue_btn)
            time.sleep(2)
            self.wait_for_page_load()

            def find_submit_btn():
                return self.wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'submit')] | //input[@value='Submit'] | //input[@type='submit']")
                ))
            
            submit_btn = self.find_in_context(find_submit_btn)
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            try:
                submit_btn.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", submit_btn)
            time.sleep(2)
            self.wait_for_page_load()

            def find_done_btn():
                return self.wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'done')] | //input[@value='Done'] | //a[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'done')]")
                ))
            
            done_btn = self.find_in_context(find_done_btn)
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", done_btn)
            try:
                done_btn.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", done_btn)
            time.sleep(2)
            self.wait_for_page_load()

            return True
        except Exception as e:
            print(f"Error processing result: {str(e)}")
            return False

    def post_login_search_flow(self, keyword):
        try:
            def find_img():
                el = self.wait.until(EC.presence_of_element_located((By.ID, "img4")))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                return el
            
            img_el = self.find_in_context(find_img)
            try:
                self.wait.until(EC.element_to_be_clickable((By.ID, "img4")))
                img_el.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", img_el)
            time.sleep(1)

            def find_search():
                el = self.wait.until(EC.presence_of_element_located((By.ID, "lbtnSearch")))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                return el
            
            search_el = self.find_in_context(find_search)
            try:
                self.wait.until(EC.element_to_be_clickable((By.ID, "lbtnSearch")))
                search_el.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", search_el)
            time.sleep(1)
            self.wait_for_page_load()

            def find_keyword():
                el = self.wait.until(EC.presence_of_element_located((By.ID, "txtKeyword")))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                return el
            
            keyword_el = self.find_in_context(find_keyword)
            keyword_el.clear()
            keyword_el.send_keys(keyword)
            time.sleep(1)

            def find_btn_search():
                el = self.wait.until(EC.element_to_be_clickable((By.ID, "btnSearch")))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                return el
            
            btn_search = self.find_in_context(find_btn_search)
            btn_search.click()
            time.sleep(2)
            self.wait_for_page_load()

            def find_all_results():
                return self.driver.find_elements(By.CSS_SELECTOR, ".x-grid3-row .x-grid3-cell-inner a, .x-grid3-cell-inner a")
            
            results = self.find_in_context(find_all_results)
            print(f"Found {len(results)} search results")

            for idx, result in enumerate(results):
                print(f"Processing result {idx + 1}/{len(results)}")
                
                current_window = self.driver.current_window_handle
                
                success = self.process_single_result(result)
                
                if success:
                    print(f"Result {idx + 1} processed successfully")
                else:
                    print(f"Result {idx + 1} failed to process")
                
                try:
                    self.driver.switch_to.window(current_window)
                except Exception:
                    pass
                
                time.sleep(1)
                
                if idx < len(results) - 1:
                    def find_all_results_again():
                        return self.driver.find_elements(By.CSS_SELECTOR, ".x-grid3-row .x-grid3-cell-inner a, .x-grid3-cell-inner a")
                    results = self.find_in_context(find_all_results_again)

        except Exception as e:
            print(f"Error in search flow: {str(e)}")

    def login_as_supplier(self, username, password):
        try:
            self.driver.get(self.base_url)
            self.wait_for_page_load()
            self.close_popup_if_present()

            if not self.force_click_dropdown():
                return False

            self.close_popup_if_present()

            if not self.force_click_supplier_login():
                return False

            time.sleep(3)
            self.close_popup_if_present()
            self.wait_for_page_load()
            self.switch_to_latest_tab(wait_for_new=True, timeout=7)
            self.click_intermediate_bottom_button()
            self.prepare_login_context()

            username_selectors = [
                "#txtUserName",
                "input[name='txtUserName']",
                "xpath://input[contains(translate(@id, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'user')]"
            ]
            
            username_found = False
            for selector in username_selectors:
                try:
                    if selector.startswith("xpath:"):
                        username_input = self.driver.find_element(By.XPATH, selector.replace("xpath:", "", 1))
                    else:
                        username_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                    username_input.clear()
                    username_input.send_keys(username)
                    username_found = True
                    break
                except Exception:
                    continue
            
            if not username_found:
                return False

            password_selectors = [
                "#txtPassword",
                "input[name='txtPassword']",
                "input[type='password']"
            ]
            
            password_found = False
            for selector in password_selectors:
                try:
                    password_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                    password_input.clear()
                    password_input.send_keys(password)
                    password_found = True
                    break
                except Exception:
                    continue
            
            if not password_found:
                return False

            self.close_popup_if_present()

            login_selectors = ["#btnLogin", "input[type='submit']", "button[type='submit']"]
            login_clicked = False
            
            for selector in login_selectors:
                try:
                    login_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if login_button.is_enabled():
                        self.driver.execute_script("arguments[0].click();", login_button)
                        login_clicked = True
                        break
                except Exception:
                    continue
            
            if not login_clicked:
                return False

            time.sleep(5)
            self.close_popup_if_present()
            self.wait_for_page_load()
            self.switch_to_latest_tab(wait_for_new=False, timeout=5)

            self.post_login_search_flow("Information technology")

            final_url = self.driver.current_url
            return "dashboard" in final_url.lower() or "home" in final_url.lower()

        except Exception:
            return False

    def close(self):
        try:
            self.driver.quit()
        except:
            pass


def main():
    username = "quanbysolutions"
    password = "qby024"

    bot = PhilGEPSLogin(headless=False)
    
    try:
        result = bot.login_as_supplier(username, password)
        print("Login successful!" if result else "Login failed!")
        input("\nPress Enter to close browser...")
    except KeyboardInterrupt:
        print("\nProcess interrupted")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        bot.close()

if __name__ == "__main__":
    main()