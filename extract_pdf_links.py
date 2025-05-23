import sys
import os

def extract_links_with_pdfplumber(pdf_path):
    """Extract links using pdfplumber library"""
    try:
        import pdfplumber
    except ImportError:
        print("pdfplumber not installed. Install with: pip install pdfplumber")
        return []
    
    links = []
    print(f"Extracting links with pdfplumber from: {pdf_path}")
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                print(f"Scanning page {page_num}...")
                
                # Extract annotations (where hyperlinks are stored)
                if hasattr(page, 'annots') and page.annots:
                    for annot in page.annots:
                        if annot.get('uri'):  # Check if annotation is a hyperlink
                            uri = annot['uri']
                            # Get the text associated with the hyperlink
                            text = ''
                            if annot.get('contents'):
                                text = annot['contents']
                            elif annot.get('rect'):  # Extract text within the rectangle of the link
                                rect = annot['rect']
                                try:
                                    text = page.within_bbox(rect).extract_text() or ''
                                except:
                                    text = 'Unable to extract text'
                            
                            links.append({
                                'method': 'pdfplumber',
                                'page': page_num,
                                'text': text.strip(),
                                'url': uri
                            })
                            print(f"  Found link: {uri}")
    except Exception as e:
        print(f"Error with pdfplumber: {e}")
    
    return links

def extract_links_with_pymupdf(pdf_path):
    """Extract links using PyMuPDF (fitz) library"""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("PyMuPDF not installed. Install with: pip install pymupdf")
        return []
    
    links = []
    print(f"Extracting links with PyMuPDF from: {pdf_path}")
    
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            print(f"Scanning page {page_num + 1}...")
            
            page_links = page.get_links()
            for link in page_links:
                if link.get('uri'):  # Check for external URLs
                    uri = link['uri']
                    # Extract text near the link's coordinates
                    text = ''
                    if 'from' in link:
                        rect = link['from']  # Rectangle of the link
                        try:
                            text = page.get_text("text", clip=rect) or ''
                        except:
                            text = 'Unable to extract text'
                    
                    links.append({
                        'method': 'PyMuPDF',
                        'page': page_num + 1,
                        'text': text.strip(),
                        'url': uri
                    })
                    print(f"  Found link: {uri}")
        
        doc.close()
    except Exception as e:
        print(f"Error with PyMuPDF: {e}")
    
    return links

def search_for_youtube_patterns(pdf_path):
    """Search for YouTube-related text patterns in the PDF"""
    try:
        import pdfplumber
    except ImportError:
        print("pdfplumber not installed for text search")
        return []
    
    youtube_patterns = [
        'youtube.com',
        'youtu.be',
        'demo video',
        'mini demo',
        'watch video',
        'video link'
    ]
    
    findings = []
    print(f"Searching for YouTube-related patterns...")
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text() or ''
                
                for pattern in youtube_patterns:
                    if pattern.lower() in text.lower():
                        # Find the line containing the pattern
                        lines = text.split('\n')
                        for line_num, line in enumerate(lines):
                            if pattern.lower() in line.lower():
                                findings.append({
                                    'page': page_num,
                                    'pattern': pattern,
                                    'line': line.strip(),
                                    'context': f"Line {line_num + 1}"
                                })
    except Exception as e:
        print(f"Error searching for patterns: {e}")
    
    return findings

def main():
    pdf_path = "docs/Field Day Program 2024.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"PDF file not found: {pdf_path}")
        return
    
    print("=" * 80)
    print("PDF LINK EXTRACTOR")
    print("=" * 80)
    print(f"Analyzing: {pdf_path}")
    print()
    
    # Extract links using both methods
    all_links = []
    
    # Method 1: pdfplumber
    print("Method 1: Using pdfplumber")
    print("-" * 40)
    pdfplumber_links = extract_links_with_pdfplumber(pdf_path)
    all_links.extend(pdfplumber_links)
    print()
    
    # Method 2: PyMuPDF
    print("Method 2: Using PyMuPDF")
    print("-" * 40)
    pymupdf_links = extract_links_with_pymupdf(pdf_path)
    all_links.extend(pymupdf_links)
    print()
    
    # Method 3: Text pattern search
    print("Method 3: Searching for YouTube-related patterns")
    print("-" * 40)
    pattern_findings = search_for_youtube_patterns(pdf_path)
    print()
    
    # Display results
    print("RESULTS")
    print("=" * 80)
    
    if all_links:
        print(f"Found {len(all_links)} hyperlinks:")
        print()
        
        for i, link in enumerate(all_links, 1):
            print(f"{i}. METHOD: {link['method']}")
            print(f"   PAGE: {link['page']}")
            print(f"   TEXT: {link['text']}")
            print(f"   URL: {link['url']}")
            print()
    else:
        print("No hyperlinks found in the PDF.")
        print()
    
    if pattern_findings:
        print(f"Found {len(pattern_findings)} YouTube-related text patterns:")
        print()
        
        for i, finding in enumerate(pattern_findings, 1):
            print(f"{i}. PAGE: {finding['page']}")
            print(f"   PATTERN: {finding['pattern']}")
            print(f"   LINE: {finding['line']}")
            print(f"   CONTEXT: {finding['context']}")
            print()
    else:
        print("No YouTube-related patterns found in text.")
    
    # Summary and recommendations
    print("RECOMMENDATIONS")
    print("=" * 80)
    
    if all_links:
        youtube_links = [link for link in all_links if 'youtube' in link['url'].lower() or 'youtu.be' in link['url'].lower()]
        if youtube_links:
            print(f"✓ Found {len(youtube_links)} YouTube links in the PDF!")
        else:
            print("- No YouTube links found, but other links are present.")
            print("- Check if demo videos are referenced without direct links.")
    else:
        print("- No embedded hyperlinks found in the PDF.")
        print("- The demo videos might be available at:")
        print("  • JoeAratari.com (check for Field Day Program section)")
        print("  • @JoeAratari on Instagram")
        print("  • @JoeAratari on Twitter/X")
        print("  • YouTube channel under Joe Aratari's name")
    
    if pattern_findings:
        print("- Found references to videos in the text - check these locations manually.")
    
    print("\nNote: If links are not embedded, they may be provided separately")
    print("through Joe Aratari's website or social media platforms.")

if __name__ == "__main__":
    main() 