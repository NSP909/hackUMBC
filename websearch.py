import re
import requests
from bs4 import BeautifulSoup
from typing import Optional
from urllib.parse import quote_plus

def extract_url(query: str) -> Optional[str]:
    """Extract URL from the query if present."""
    url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    match = url_pattern.search(query)
    return match.group(0) if match else None

def scrape_website(url: str) -> str:
    """Scrape content from a given URL."""
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        for script in soup(["script", "style"]):
            script.decompose()
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        return text
    except requests.RequestException as e:
        return f"Error scraping website: {str(e)}"

def google_search(query: str) -> Optional[str]:
    """
    Perform a basic Google search and return the first result URL.
    Note: This method is not recommended for production use.
    """
    search_url = f"https://www.google.com/search?q={quote_plus(query)}"
    try:
        response = requests.get(search_url, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        search_results = soup.find_all('div', class_='yuRUbf')
        if search_results:
            first_result = search_results[0].find('a')['href']
            return first_result
        else:
            return None
    except requests.RequestException as e:
        print(f"Error performing Google search: {str(e)}")
        return None

def process_query(query: str) -> str:
    url = extract_url(query)
    
    if url:
        print(f"URL found in query: {url}")
        return scrape_website(url)
    else:
        print("No URL found in query. Performing Google search...")
        search_result_url = google_search(query)
        if search_result_url:
            print(f"Scraping first search result: {search_result_url}")
            return scrape_website(search_result_url)
        else:
            return "No search results found."

# Example usage
if __name__ == "__main__":
    # Test with a URL in the query
    result1 = process_query("Get info from https://www.example.com")
    print("Result 1:", result1[:500] + "..." if len(result1) > 500 else result1)
    
    # Test with a query without a URL
    result2 = process_query("Latest news about artificial intelligence")
    print("Result 2:", result2[:500] + "..." if len(result2) > 500 else result2)