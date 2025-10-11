"""
PhilGEPS Login and Search Automation with CSV Export

WORKFLOW:
1. Login to PhilGEPS
2. Search for keyword
3. Process ALL search results (potentially thousands):
   - Click each result
   - Extract Reference Number and Title
   - Save to CSV
   - Click "Order" link
   - Click clickable text in next page
   - Click "Continue" button
   - Click "Submit" button
   - Click "Done" button
   - Return to search results
   - Repeat for next result
"""

import time
import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException

class PhilGEPSLogin:
    def __init__(self, headless=False, csv_filename="philgeps_results.csv"):
        self.base_url = "https://notices.philgeps.gov.ph/"
        self.csv_filename = csv_filename
        self.init_csv()
        
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

    def init_csv(self):
        """Initialize CSV file with headers"""
        file_exists = os.path.isfile(self.csv_filename)
        if not file_exists:
            with open(self.csv_filename, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['Reference Number', 'Title'])
            print(f"Created CSV file: {self.csv_filename}")

    def save_to_csv(self, reference_number, title):
        """Append reference number and title to CSV"""
        try:
            with open(self.csv_filename, 'a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([reference_number, title])
            print(f"Saved to CSV: {reference_number} - {title[:50]}...")
            return True
        except Exception as e:
            print(f"Error saving to CSV: {str(e)}")
            return False

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

    def extract_reference_and_title(self):
        """Extract reference number and title from current page"""
        ref_number = "N/A"
        title = "N/A"
        
        ref_selectors = [
            (By.XPATH, "//label[contains(text(), 'Reference')]/following-sibling::*"),
            (By.XPATH, "//*[contains(text(), 'Reference Number')]/following-sibling::*"),
            (By.XPATH, "//*[contains(@id, 'ref') or contains(@id, 'Ref')]"),
            (By.CSS_SELECTOR, "#lblRefNo, #refNo, #referenceNumber")
        ]
        
        for by, selector in ref_selectors:
            try:
                element = self.driver.find_element(by, selector)
                text = element.text.strip()
                if text and text != "":
                    ref_number = text
                    print(f"Found reference: {ref_number}")
                    break
            except:
                continue
        
        title_selectors = [
            (By.XPATH, "//label[contains(text(), 'Title')]/following-sibling::*"),
            (By.XPATH, "//*[contains(@id, 'title') or contains(@id, 'Title')]"),
            (By.CSS_SELECTOR, "#lblTitle, .title, h1, h2"),
            (By.XPATH, "//td[contains(text(), 'Title')]/following-sibling::td")
        ]
        
        for by, selector in title_selectors:
            try:
                element = self.driver.find_element(by, selector)
                text = element.text.strip()
                if text and len(text) > 5:
                    title = text
                    print(f"Found title: {title[:50]}...")
                    break
            except:
                continue
        
        return ref_number, title

    def process_single_result_workflow(self):
        """Process workflow after clicking a result: extract data, click Order->text->Continue->Submit->Done"""
        try:
            print("Extracting reference number and title...")
            ref_number, title = self.extract_reference_and_title()
            
            self.save_to_csv(ref_number, title)
            
            print("Looking for Order link...")
            order_selectors = [
                "//a[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'order')]",
                "//a[@id='lbtnNosOfAssoc']",
                "//a[contains(@href, 'order')]",
                "//span[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'order')]//parent::a",
                "//*[contains(text(), 'Order')]"
            ]
            
            order_link = None
            for selector in order_selectors:
                try:
                    def find_order():
                        return self.wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                    order_link = self.find_in_context(find_order)
                    print(f"Found Order link")
                    break
                except Exception:
                    continue
            
            if not order_link:
                print("Order link not found, skipping workflow")
                return False
            
            try:
                order_link.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", order_link)
            print("Clicked Order link")
            time.sleep(2)
            self.wait_for_page_load()

            print("Looking for clickable text in page...")
            clickable_selectors = [
                "//div[contains(@class,'x-grid3-cell-inner')]//a",
                "//td[contains(@class,'x-grid3-cell')]//a",
                "//div[@class='x-grid3-body']//a",
                "//table//td//a",
                "//a[contains(@href, '#')]"
            ]
            
            clickable_link = None
            for selector in clickable_selectors:
                try:
                    def find_clickable():
                        return self.wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                    clickable_link = self.find_in_context(find_clickable)
                    print(f"Found clickable link: {clickable_link.text[:50]}...")
                    break
                except Exception:
                    continue
            
            if not clickable_link:
                print("Clickable link not found")
                return False
            
            try:
                clickable_link.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", clickable_link)
            print("Clicked text link")
            time.sleep(2)
            self.wait_for_page_load()

            print("Looking for Continue button...")
            continue_selectors = [
                "//button[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'continue')]",
                "//input[@value='Continue' or @value='CONTINUE']",
                "//a[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'continue')]",
                "//button[@type='button' and contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'continue')]"
            ]
            
            continue_btn = None
            for selector in continue_selectors:
                try:
                    def find_continue():
                        return self.wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                    continue_btn = self.find_in_context(find_continue)
                    print(f"Found Continue button")
                    break
                except Exception:
                    continue
            
            if not continue_btn:
                print("Continue button not found")
                return False
            
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", continue_btn)
            time.sleep(0.5)
            try:
                continue_btn.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", continue_btn)
            print("Clicked Continue button")
            time.sleep(2)
            self.wait_for_page_load()

            print("Looking for Submit button...")
            submit_selectors = [
                "//button[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'submit')]",
                "//input[@value='Submit' or @value='SUBMIT']",
                "//input[@type='submit']",
                "//button[@type='submit']"
            ]
            
            submit_btn = None
            for selector in submit_selectors:
                try:
                    def find_submit():
                        return self.wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                    submit_btn = self.find_in_context(find_submit)
                    print(f"Found Submit button")
                    break
                except Exception:
                    continue
            
            if not submit_btn:
                print("Submit button not found")
                return False
            
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
            time.sleep(0.5)
            try:
                submit_btn.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", submit_btn)
            print("Clicked Submit button")
            time.sleep(2)
            self.wait_for_page_load()

            print("Looking for Done button...")
            done_selectors = [
                "//button[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'done')]",
                "//input[@value='Done' or @value='DONE']",
                "//a[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'done')]",
                "//button[contains(translate(@value,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'done')]"
            ]
            
            done_btn = None
            for selector in done_selectors:
                try:
                    def find_done():
                        return self.wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                    done_btn = self.find_in_context(find_done)
                    print(f"Found Done button")
                    break
                except Exception:
                    continue
            
            if not done_btn:
                print("Done button not found")
                return False
            
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", done_btn)
            time.sleep(0.5)
            try:
                done_btn.click()
            except Exception:
                self.driver.execute_script("arguments[0].click();", done_btn)
            print("Clicked Done button")
            time.sleep(2)
            self.wait_for_page_load()

            return True
        except Exception as e:
            print(f"Error in workflow: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

    def post_login_search_flow(self, keyword):
        """Search and process ALL results"""
        try:
            print("Starting post-login search flow...")
            
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
            print("Clicked menu image")
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
            print("Clicked Search link")
            time.sleep(2)
            self.wait_for_page_load()

            def find_keyword():
                el = self.wait.until(EC.presence_of_element_located((By.ID, "txtKeyword")))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                return el
            
            keyword_el = self.find_in_context(find_keyword)
            keyword_el.clear()
            keyword_el.send_keys(keyword)
            print(f"Entered keyword: {keyword}")
            time.sleep(1)

            def find_btn_search():
                el = self.wait.until(EC.element_to_be_clickable((By.ID, "btnSearch")))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                return el
            
            btn_search = self.find_in_context(find_btn_search)
            btn_search.click()
            print("Clicked Search button")
            time.sleep(3)
            self.wait_for_page_load()

            print("Waiting for search results to load...")
            time.sleep(2)

            result_selectors = [
                ".x-grid3-row .x-grid3-cell-inner a",
                ".x-grid3-cell a",
                "div[class*='x-grid3'] a",
                "table[class*='x-grid3'] a",
                "div.x-grid3-body a"
            ]
            
            processed_count = 0
            
            while True:
                results = []
                for selector in result_selectors:
                    try:
                        def find_results():
                            return self.driver.find_elements(By.CSS_SELECTOR, selector)
                        
                        found_results = self.find_in_context(find_results)
                        if found_results and len(found_results) > 0:
                            results = found_results
                            print(f"Found {len(results)} results on current page")
                            break
                    except Exception:
                        continue
                
                if not results:
                    print("No more results found")
                    break

                for idx in range(len(results)):
                    print(f"\n=== Processing result {processed_count + 1} (Item {idx + 1} on current page) ===")
                    
                    try:
                        def get_current_results():
                            for selector in result_selectors:
                                try:
                                    found = self.driver.find_elements(By.CSS_SELECTOR, selector)
                                    if found and len(found) > 0:
                                        return found
                                except:
                                    continue
                            return []
                        
                        current_results = self.find_in_context(get_current_results)
                        
                        if idx >= len(current_results):
                            print(f"Result index {idx} out of range")
                            break
                        
                        current_result = current_results[idx]
                        result_text = current_result.text
                        print(f"Clicking result: {result_text[:50]}...")
                        
                        current_window = self.driver.current_window_handle
                        
                        try:
                            current_result.click()
                        except Exception:
                            self.driver.execute_script("arguments[0].click();", current_result)
                        
                        time.sleep(2)
                        self.wait_for_page_load()
                        
                        success = self.process_single_result_workflow()
                        
                        if success:
                            print(f"Result {processed_count + 1} completed successfully")
                            processed_count += 1
                        else:
                            print(f"Result {processed_count + 1} incomplete")
                        
                        try:
                            if len(self.driver.window_handles) > 1:
                                for handle in self.driver.window_handles:
                                    if handle != current_window:
                                        self.driver.switch_to.window(handle)
                                        self.driver.close()
                            self.driver.switch_to.window(current_window)
                        except Exception as e:
                            print(f"Error switching windows: {str(e)}")
                        
                        time.sleep(2)
                        
                    except Exception as e:
                        print(f"Error processing result: {str(e)}")
                        continue

                print("\nLooking for Next page button...")
                next_button_found = False
                next_selectors = [
                    "//button[contains(text(), 'Next')]",
                    "//a[contains(text(), 'Next')]",
                    "//img[@alt='Next Page']",
                    "//div[contains(@class, 'x-tbar-page-next')]",
                    "//*[contains(@class, 'next')]"
                ]
                
                for selector in next_selectors:
                    try:
                        def find_next():
                            return self.wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                        next_btn = self.find_in_context(find_next)
                        
                        try:
                            next_btn.click()
                        except Exception:
                            self.driver.execute_script("arguments[0].click();", next_btn)
                        
                        print("Clicked Next button, loading next page...")
                        time.sleep(3)
                        self.wait_for_page_load()
                        next_button_found = True
                        break
                    except Exception:
                        continue
                
                if not next_button_found:
                    print("No Next button found - all results processed")
                    break

            print(f"\n=== COMPLETED: Processed {processed_count} total results ===")

        except Exception as e:
            print(f"Error in search flow: {str(e)}")
            import traceback
            traceback.print_exc()

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

            self.post_login_search_flow("system")

            return True

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

    bot = PhilGEPSLogin(headless=False, csv_filename="philgeps_results.csv")
    
    try:
        result = bot.login_as_supplier(username, password)
        print("Process completed!" if result else "Process failed!")
        print(f"Data saved to: {bot.csv_filename}")
        input("\nPress Enter to close browser...")
    except KeyboardInterrupt:
        print("\nProcess interrupted")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        bot.close()

if __name__ == "__main__":
    main()