"""
Comprehensive backend API tests for The Neoverse.
Tests all public and admin endpoints as specified in the review request.
"""
import requests
import sys
from typing import Dict, Any, Optional

BASE_URL = "https://the-archive-3.preview.emergentagent.com/api"
ADMIN_PASSWORD = "neoverse2025"


class NeoverseAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.admin_token: Optional[str] = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log(self, message: str, level: str = "INFO"):
        """Log test messages"""
        prefix = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "FAIL": "❌",
            "WARN": "⚠️"
        }.get(level, "•")
        print(f"{prefix} {message}")

    def test(self, name: str, method: str, endpoint: str, 
             expected_status: int, data: Optional[Dict] = None,
             headers: Optional[Dict] = None, params: Optional[Dict] = None) -> tuple[bool, Any]:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        req_headers = {"Content-Type": "application/json"}
        
        if headers:
            req_headers.update(headers)
        
        if self.admin_token and "admin" in endpoint:
            req_headers["Authorization"] = f"Bearer {self.admin_token}"

        self.tests_run += 1
        self.log(f"Testing: {name}", "INFO")
        
        try:
            if method == "GET":
                response = requests.get(url, headers=req_headers, params=params, timeout=10)
            elif method == "POST":
                response = requests.post(url, json=data, headers=req_headers, timeout=10)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=req_headers, timeout=10)
            elif method == "DELETE":
                response = requests.delete(url, headers=req_headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"PASSED - {name} (Status: {response.status_code})", "SUCCESS")
            else:
                self.log(f"FAILED - {name} (Expected {expected_status}, got {response.status_code})", "FAIL")
                self.log(f"Response: {response.text[:200]}", "WARN")
                self.failed_tests.append({
                    "name": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })

            try:
                return success, response.json()
            except:
                return success, response.text

        except Exception as e:
            self.log(f"FAILED - {name} (Error: {str(e)})", "FAIL")
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def run_all_tests(self):
        """Execute all backend tests"""
        self.log("=" * 60, "INFO")
        self.log("Starting The Neoverse Backend API Tests", "INFO")
        self.log("=" * 60, "INFO")

        # ===== PUBLIC ENDPOINTS =====
        self.log("\n📚 Testing Public Endpoints", "INFO")
        
        # Test albums
        self.log("\n--- Albums ---", "INFO")
        success, albums = self.test(
            "GET /api/albums returns published albums",
            "GET", "albums", 200
        )
        if success and isinstance(albums, list):
            self.log(f"Found {len(albums)} albums", "INFO")
            expected_slugs = ["neon-rodeo", "an-american-reckoning", 
                            "we-didnt-survive-to-be-quiet", "burn-bright-stay-free"]
            found_slugs = [a.get("slug") for a in albums]
            for slug in expected_slugs:
                if slug in found_slugs:
                    self.log(f"✓ Found album: {slug}", "SUCCESS")
                else:
                    self.log(f"✗ Missing album: {slug}", "FAIL")
                    self.failed_tests.append({
                        "name": f"Album {slug} not found",
                        "endpoint": "albums"
                    })

        # Test single album
        success, album = self.test(
            "GET /api/albums/neon-rodeo returns single album",
            "GET", "albums/neon-rodeo", 200
        )
        if success:
            if album.get("title") and album.get("slug") == "neon-rodeo":
                self.log(f"Album details: title='{album.get('title')}'", "INFO")
            else:
                self.log("Album missing expected fields", "WARN")

        # Test library
        self.log("\n--- Library ---", "INFO")
        success, library = self.test(
            "GET /api/library returns published entries",
            "GET", "library", 200
        )
        if success and isinstance(library, list):
            self.log(f"Found {len(library)} library entries", "INFO")

        # Test symbols
        self.log("\n--- Symbols ---", "INFO")
        success, symbols = self.test(
            "GET /api/symbols returns published symbols",
            "GET", "symbols", 200
        )
        if success and isinstance(symbols, list):
            self.log(f"Found {len(symbols)} symbols", "INFO")

        # Test single symbol
        success, symbol = self.test(
            "GET /api/symbols/selune returns Sélune symbol",
            "GET", "symbols/selune", 200
        )
        if success:
            if symbol.get("name"):
                self.log(f"Symbol details: name='{symbol.get('name')}'", "INFO")

        # Test roadhouse
        self.log("\n--- Roadhouse ---", "INFO")
        success, roadhouse = self.test(
            "GET /api/roadhouse returns published posts",
            "GET", "roadhouse", 200
        )
        if success and isinstance(roadhouse, list):
            self.log(f"Found {len(roadhouse)} roadhouse posts", "INFO")

        # Test observatory
        self.log("\n--- Observatory ---", "INFO")
        success, observatory = self.test(
            "GET /api/observatory returns published artworks",
            "GET", "observatory", 200
        )
        if success and isinstance(observatory, list):
            self.log(f"Found {len(observatory)} artworks", "INFO")

        # ===== INVOCATION TESTS =====
        self.log("\n📧 Testing Invocation (Email Signup)", "INFO")
        
        # Valid email - first submission
        test_email = "wanderer@neoverse.dev"
        success, response = self.test(
            "POST /api/invocation with valid email (first time)",
            "POST", "invocation", 200,
            data={"email": test_email, "first_name": "Wanderer", "source": "test"}
        )
        if success:
            if response.get("ok") and not response.get("already_subscribed"):
                self.log("First subscription successful", "SUCCESS")
            else:
                self.log(f"Unexpected response: {response}", "WARN")

        # Same email - second submission
        success, response = self.test(
            "POST /api/invocation with same email (already subscribed)",
            "POST", "invocation", 200,
            data={"email": test_email, "first_name": "Wanderer", "source": "test"}
        )
        if success:
            if response.get("ok") and response.get("already_subscribed"):
                self.log("Already subscribed check working", "SUCCESS")
            else:
                self.log(f"Expected already_subscribed=true, got: {response}", "WARN")

        # Invalid email
        success, response = self.test(
            "POST /api/invocation with invalid email returns 422",
            "POST", "invocation", 422,
            data={"email": "not-an-email", "first_name": "Test"}
        )

        # ===== ADMIN AUTH TESTS =====
        self.log("\n🔐 Testing Admin Authentication", "INFO")
        
        # Login with correct password
        success, response = self.test(
            "POST /api/admin/login with correct password",
            "POST", "admin/login", 200,
            data={"password": ADMIN_PASSWORD}
        )
        if success and response.get("access_token"):
            self.admin_token = response["access_token"]
            self.log("Admin token obtained", "SUCCESS")
        else:
            self.log("Failed to get admin token - admin tests will fail", "FAIL")

        # Login with wrong password
        success, response = self.test(
            "POST /api/admin/login with wrong password returns 401",
            "POST", "admin/login", 401,
            data={"password": "wrongpassword"}
        )

        # GET /admin/me without token
        temp_token = self.admin_token
        self.admin_token = None
        success, response = self.test(
            "GET /api/admin/me without token returns 401",
            "GET", "admin/me", 401
        )
        self.admin_token = temp_token

        # GET /admin/me with valid token
        if self.admin_token:
            success, response = self.test(
                "GET /api/admin/me with valid token",
                "GET", "admin/me", 200
            )
            if success and response.get("role") == "admin":
                self.log("Admin role verified", "SUCCESS")

        # ===== ADMIN CRUD TESTS =====
        if self.admin_token:
            self.log("\n🛠️  Testing Admin CRUD Operations", "INFO")

            # Test subscribers list
            self.log("\n--- Subscribers ---", "INFO")
            success, subscribers = self.test(
                "GET /api/admin/subscribers requires admin token",
                "GET", "admin/subscribers", 200
            )
            if success and isinstance(subscribers, list):
                self.log(f"Found {len(subscribers)} subscribers", "INFO")
                # Check if our test email is there
                emails = [s.get("email") for s in subscribers]
                if test_email in emails:
                    self.log(f"Test subscriber '{test_email}' found in list", "SUCCESS")

            # Test album CRUD
            self.log("\n--- Album CRUD ---", "INFO")
            test_album_slug = "test-room-backend"
            test_album_id = None

            # Create album
            success, album = self.test(
                "POST /api/admin/albums creates new album",
                "POST", "admin/albums", 200,
                data={
                    "slug": test_album_slug,
                    "title": "Test Room Backend",
                    "atmosphere": "default",
                    "status": "published"
                }
            )
            if success and album.get("id"):
                test_album_id = album["id"]
                self.log(f"Created album with ID: {test_album_id}", "SUCCESS")

            # Try creating duplicate slug
            if test_album_id:
                success, response = self.test(
                    "POST /api/admin/albums with duplicate slug returns 409",
                    "POST", "admin/albums", 409,
                    data={
                        "slug": test_album_slug,
                        "title": "Duplicate",
                        "atmosphere": "default"
                    }
                )

            # Update album
            if test_album_id:
                success, updated = self.test(
                    "PUT /api/admin/albums/{id} updates album",
                    "PUT", f"admin/albums/{test_album_id}", 200,
                    data={
                        "slug": test_album_slug,
                        "title": "Test Room Updated",
                        "atmosphere": "default",
                        "status": "published"
                    }
                )

            # Delete album
            if test_album_id:
                success, response = self.test(
                    "DELETE /api/admin/albums/{id} removes album",
                    "DELETE", f"admin/albums/{test_album_id}", 200
                )

            # Test library CRUD (one create + delete)
            self.log("\n--- Library CRUD ---", "INFO")
            test_lib_id = None
            success, entry = self.test(
                "POST /api/admin/library creates entry",
                "POST", "admin/library", 200,
                data={
                    "slug": "test-poem-backend",
                    "title": "Test Poem",
                    "type": "poem",
                    "body": "Test content",
                    "status": "published"
                }
            )
            if success and entry.get("id"):
                test_lib_id = entry["id"]
                success, response = self.test(
                    "DELETE /api/admin/library/{id} removes entry",
                    "DELETE", f"admin/library/{test_lib_id}", 200
                )

            # Test symbols CRUD
            self.log("\n--- Symbols CRUD ---", "INFO")
            test_sym_id = None
            success, symbol = self.test(
                "POST /api/admin/symbols creates symbol",
                "POST", "admin/symbols", 200,
                data={
                    "slug": "test-symbol-backend",
                    "name": "Test Symbol",
                    "status": "published"
                }
            )
            if success and symbol.get("id"):
                test_sym_id = symbol["id"]
                success, response = self.test(
                    "DELETE /api/admin/symbols/{id} removes symbol",
                    "DELETE", f"admin/symbols/{test_sym_id}", 200
                )

            # Test roadhouse CRUD
            self.log("\n--- Roadhouse CRUD ---", "INFO")
            test_road_id = None
            success, post = self.test(
                "POST /api/admin/roadhouse creates post",
                "POST", "admin/roadhouse", 200,
                data={
                    "slug": "test-post-backend",
                    "title": "Test Post",
                    "type": "news",
                    "status": "published"
                }
            )
            if success and post.get("id"):
                test_road_id = post["id"]
                success, response = self.test(
                    "DELETE /api/admin/roadhouse/{id} removes post",
                    "DELETE", f"admin/roadhouse/{test_road_id}", 200
                )

            # Test observatory CRUD
            self.log("\n--- Observatory CRUD ---", "INFO")
            test_art_id = None
            success, art = self.test(
                "POST /api/admin/observatory creates artwork",
                "POST", "admin/observatory", 200,
                data={
                    "slug": "test-art-backend",
                    "title": "Test Artwork",
                    "image_url": "https://example.com/test.jpg",
                    "status": "published"
                }
            )
            if success and art.get("id"):
                test_art_id = art["id"]
                success, response = self.test(
                    "DELETE /api/admin/observatory/{id} removes artwork",
                    "DELETE", f"admin/observatory/{test_art_id}", 200
                )

        else:
            self.log("Skipping admin CRUD tests - no admin token", "WARN")

        # ===== SUMMARY =====
        self.log("\n" + "=" * 60, "INFO")
        self.log("Test Summary", "INFO")
        self.log("=" * 60, "INFO")
        self.log(f"Total tests: {self.tests_run}", "INFO")
        self.log(f"Passed: {self.tests_passed}", "SUCCESS")
        self.log(f"Failed: {len(self.failed_tests)}", "FAIL" if self.failed_tests else "SUCCESS")
        
        if self.failed_tests:
            self.log("\nFailed Tests:", "FAIL")
            for fail in self.failed_tests:
                self.log(f"  • {fail.get('name', 'Unknown')} - {fail.get('endpoint', '')}", "FAIL")
                if 'error' in fail:
                    self.log(f"    Error: {fail['error']}", "WARN")
                elif 'expected' in fail:
                    self.log(f"    Expected {fail['expected']}, got {fail['actual']}", "WARN")

        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        self.log(f"\nSuccess Rate: {success_rate:.1f}%", "SUCCESS" if success_rate >= 90 else "WARN")
        
        return 0 if len(self.failed_tests) == 0 else 1


def main():
    tester = NeoverseAPITester()
    return tester.run_all_tests()


if __name__ == "__main__":
    sys.exit(main())
