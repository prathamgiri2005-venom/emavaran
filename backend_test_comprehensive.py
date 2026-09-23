import requests
import sys
from datetime import datetime, timedelta
import json

class EmavaranaComprehensiveTester:
    def __init__(self, base_url="https://ebe5b743-f0c6-404e-9b2f-bc8dd3e5dcff.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=default_headers, timeout=10)

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

    def test_services_pricing(self):
        """Test services endpoint for correct pricing"""
        success, response = self.run_test("Get Services with Pricing", "GET", "api/services", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} services")
            
            # Check for 7 services
            if len(response) != 7:
                print(f"⚠️  Warning: Expected 7 services, found {len(response)}")
            
            # Check pricing
            student_therapy = None
            other_services = []
            
            for service in response:
                title = service.get('title', '')
                price = service.get('price', 0)
                price_display = service.get('price_display', '')
                
                print(f"   Service: {title} - Price: {price_display}")
                
                if 'Student' in title:
                    student_therapy = service
                else:
                    other_services.append(service)
            
            # Verify Student Therapy pricing
            if student_therapy:
                if student_therapy.get('price') == 799:
                    print("✅ Student Therapy pricing correct: ₹799")
                else:
                    print(f"❌ Student Therapy pricing incorrect: Expected ₹799, got {student_therapy.get('price_display')}")
            else:
                print("❌ Student Therapy service not found")
            
            # Verify other services pricing
            for service in other_services:
                if service.get('price') == 999:
                    print(f"✅ {service.get('title')} pricing correct: ₹999")
                else:
                    print(f"❌ {service.get('title')} pricing incorrect: Expected ₹999, got {service.get('price_display')}")
        
        return success

    def test_therapists_order_and_photos(self):
        """Test therapists endpoint for correct order and photo URLs"""
        success, response = self.run_test("Get Therapists Order & Photos", "GET", "api/therapists", 200)
        if success and isinstance(response, list):
            if len(response) >= 2:
                first_therapist = response[0]
                second_therapist = response[1]
                
                # Check if Manvi is first
                if first_therapist.get('name') == 'Manvi Giri':
                    print("✅ Manvi Giri is listed first")
                    # Check Manvi's photo URL (should be blue outfit)
                    manvi_photo = first_therapist.get('image_url', '')
                    if '9ciapjg1' in manvi_photo:
                        print("✅ Manvi has correct photo URL (blue outfit)")
                    else:
                        print(f"❌ Manvi photo URL incorrect: {manvi_photo}")
                else:
                    print(f"❌ Expected Manvi first, got {first_therapist.get('name')}")
                
                # Check Diksha's photo
                if second_therapist.get('name') == 'Diksha Mago':
                    diksha_photo = second_therapist.get('image_url', '')
                    if 'k1imk6ox' in diksha_photo:
                        print("✅ Diksha has correct photo URL (black blazer)")
                    else:
                        print(f"❌ Diksha photo URL incorrect: {diksha_photo}")
                else:
                    print(f"❌ Expected Diksha second, got {second_therapist.get('name')}")
        
        return success

    def test_admin_login(self):
        """Test admin login functionality"""
        # Test Manvi's login
        manvi_data = {
            "email": "manvi@emavaran.com",
            "password": "Manvi@123"
        }
        success, response = self.run_test("Admin Login - Manvi", "POST", "api/auth/login", 200, data=manvi_data)
        if success:
            self.admin_token = response.get('token')
            print(f"✅ Manvi login successful, token received")
        
        # Test Diksha's login
        diksha_data = {
            "email": "diksha@emavaran.com",
            "password": "Diksha@123"
        }
        success2, response2 = self.run_test("Admin Login - Diksha", "POST", "api/auth/login", 200, data=diksha_data)
        if success2:
            print(f"✅ Diksha login successful")
        
        return success and success2

    def test_admin_dashboard_endpoints(self):
        """Test admin dashboard endpoints"""
        if not self.admin_token:
            print("❌ No admin token available, skipping admin tests")
            return False
        
        auth_headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        # Test admin stats
        success1, stats = self.run_test("Admin Stats", "GET", "api/admin/stats", 200, headers=auth_headers)
        if success1:
            expected_keys = ['total_bookings', 'pending_bookings', 'confirmed_bookings', 'today_bookings']
            for key in expected_keys:
                if key in stats:
                    print(f"✅ Stats contains {key}: {stats[key]}")
                else:
                    print(f"❌ Stats missing {key}")
        
        # Test admin bookings
        success2, bookings = self.run_test("Admin Bookings", "GET", "api/admin/bookings", 200, headers=auth_headers)
        if success2:
            print(f"✅ Admin can access bookings: {len(bookings)} bookings found")
        
        # Test admin contacts
        success3, contacts = self.run_test("Admin Contacts", "GET", "api/admin/contacts", 200, headers=auth_headers)
        if success3:
            print(f"✅ Admin can access contacts: {len(contacts)} contacts found")
        
        return success1 and success2 and success3

    def test_booking_management(self):
        """Test booking creation and management"""
        if not self.admin_token:
            print("❌ No admin token available, skipping booking management tests")
            return False
        
        # Create a test booking
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        booking_data = {
            "therapist": "manvi",
            "date": tomorrow,
            "time": "14:00",
            "name": "Test Client",
            "email": "testclient@example.com",
            "phone": "+91 9876543210",
            "message": "Test booking for admin management"
        }
        
        success1, booking_response = self.run_test("Create Test Booking", "POST", "api/bookings", 200, data=booking_data)
        if not success1:
            return False
        
        booking_id = booking_response.get('id')
        if not booking_id:
            print("❌ No booking ID returned")
            return False
        
        # Test booking status update (confirm)
        auth_headers = {'Authorization': f'Bearer {self.admin_token}'}
        update_data = {"status": "confirmed"}
        success2, updated_booking = self.run_test(
            "Confirm Booking", 
            "PATCH", 
            f"api/admin/bookings/{booking_id}", 
            200, 
            data=update_data, 
            headers=auth_headers
        )
        
        if success2 and updated_booking.get('status') == 'confirmed':
            print("✅ Booking confirmed successfully")
        
        # Test booking status update (cancel)
        update_data = {"status": "cancelled"}
        success3, cancelled_booking = self.run_test(
            "Cancel Booking", 
            "PATCH", 
            f"api/admin/bookings/{booking_id}", 
            200, 
            data=update_data, 
            headers=auth_headers
        )
        
        if success3 and cancelled_booking.get('status') == 'cancelled':
            print("✅ Booking cancelled successfully")
        
        return success1 and success2 and success3

def main():
    print("🚀 Starting Emavaran Comprehensive API Testing...")
    print("=" * 60)
    
    tester = EmavaranaComprehensiveTester()

    # Test specific features from review request
    print("\n💰 Testing Services Pricing...")
    tester.test_services_pricing()
    
    print("\n👥 Testing Therapists Order & Photos...")
    tester.test_therapists_order_and_photos()
    
    print("\n🔐 Testing Admin Authentication...")
    tester.test_admin_login()
    
    print("\n📊 Testing Admin Dashboard...")
    tester.test_admin_dashboard_endpoints()
    
    print("\n📅 Testing Booking Management...")
    tester.test_booking_management()

    # Print results
    print("\n" + "=" * 60)
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