import requests
import sys
from datetime import datetime, timedelta
import json

class EmavaranaAPITester:
    def __init__(self, base_url="https://wellness-journey-225.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_services_endpoint(self):
        """Test services endpoint"""
        success, response = self.run_test("Get Services", "GET", "api/services", 200)
        if success and isinstance(response, list):
            expected_services = ["Individual Counseling", "Anxiety & Stress Management", "Relationship Counseling", "Emotional Wellbeing Support"]
            service_titles = [s.get('title', '') for s in response]
            for expected in expected_services:
                if expected not in service_titles:
                    print(f"⚠️  Warning: Expected service '{expected}' not found")
        return success

    def test_therapists_endpoint(self):
        """Test therapists endpoint"""
        success, response = self.run_test("Get Therapists", "GET", "api/therapists", 200)
        if success and isinstance(response, list):
            therapist_names = [t.get('name', '') for t in response]
            expected_therapists = ["Manvi Giri", "Diksha Mago"]
            for expected in expected_therapists:
                if expected not in therapist_names:
                    print(f"⚠️  Warning: Expected therapist '{expected}' not found")
        return success

    def test_blogs_endpoint(self):
        """Test blogs endpoint"""
        success, response = self.run_test("Get Blogs", "GET", "api/blogs", 200)
        if success and isinstance(response, list) and len(response) > 0:
            # Test individual blog detail
            first_blog_id = response[0].get('id')
            if first_blog_id:
                self.run_test(f"Get Blog Detail ({first_blog_id})", "GET", f"api/blogs/{first_blog_id}", 200)
        return success

    def test_faqs_endpoint(self):
        """Test FAQs endpoint"""
        return self.run_test("Get FAQs", "GET", "api/faqs", 200)

    def test_testimonials_endpoint(self):
        """Test testimonials endpoint"""
        return self.run_test("Get Testimonials", "GET", "api/testimonials", 200)

    def test_available_slots_endpoint(self):
        """Test available slots endpoint"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        params = {'date': tomorrow, 'therapist': 'manvi'}
        return self.run_test("Get Available Slots", "GET", "api/bookings/available-slots", 200, params=params)

    def test_booking_creation(self):
        """Test booking creation"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        booking_data = {
            "therapist": "manvi",
            "date": tomorrow,
            "time": "10:00",
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+91 9876543210",
            "message": "Test booking message"
        }
        return self.run_test("Create Booking", "POST", "api/bookings", 200, data=booking_data)

    def test_contact_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+91 9876543210",
            "subject": "Test Subject",
            "message": "This is a test message"
        }
        return self.run_test("Submit Contact Form", "POST", "api/contact", 200, data=contact_data)

    def test_admin_login(self):
        """Test admin login functionality"""
        login_data = {
            "email": "manvi@emavaran.com",
            "password": "Manvi@123"
        }
        success, response = self.run_test("Admin Login", "POST", "api/auth/login", 200, data=login_data)
        if success and 'access_token' in response:
            print(f"   ✅ Login successful, token received")
            return True, response['access_token']
        return False, None

    def test_admin_protected_endpoints(self, token):
        """Test admin protected endpoints"""
        if not token:
            print("❌ No token available for protected endpoint testing")
            return False
        
        headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
        
        # Test admin stats endpoint
        url = f"{self.base_url}/api/admin/stats"
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"✅ Admin Stats endpoint working - Status: {response.status_code}")
                return True
            else:
                print(f"❌ Admin Stats failed - Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Admin Stats error: {str(e)}")
            return False

def main():
    print("🚀 Starting Emavaran API Testing...")
    print("=" * 50)
    
    tester = EmavaranaAPITester()

    # Test all endpoints
    print("\n📋 Testing Core API Endpoints...")
    tester.test_health_endpoint()
    tester.test_services_endpoint()
    tester.test_therapists_endpoint()
    tester.test_blogs_endpoint()
    tester.test_faqs_endpoint()
    tester.test_testimonials_endpoint()

    print("\n📅 Testing Booking System...")
    tester.test_available_slots_endpoint()
    tester.test_booking_creation()

    print("\n📧 Testing Contact System...")
    tester.test_contact_submission()

    print("\n🔐 Testing Admin Authentication...")
    login_success, token = tester.test_admin_login()
    if login_success:
        tester.test_admin_protected_endpoints(token)

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            if 'error' in failure:
                print(f"   - {failure.get('test', 'Unknown')}: {failure['error']}")
            else:
                print(f"   - {failure.get('test', 'Unknown')}: Expected {failure.get('expected')}, got {failure.get('actual')}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())