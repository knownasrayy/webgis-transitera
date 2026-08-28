import os
import re
import subprocess
import sys
import markdown

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(EDGE_PATH):
    EDGE_PATH = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>
    @page {{
        size: A4;
        margin: 15mm 12mm 15mm 12mm;
    }}
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 10.5pt;
        line-height: 1.6;
        color: #1f2328;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
    }}
    h1 {{
        font-size: 18pt;
        border-bottom: 2px solid #0969da;
        padding-bottom: 6px;
        margin-top: 0;
        color: #0969da;
    }}
    h2 {{
        font-size: 14pt;
        border-bottom: 1px solid #d0d7de;
        padding-bottom: 4px;
        margin-top: 20px;
        color: #1f2328;
        page-break-after: avoid;
    }}
    h3 {{
        font-size: 11.5pt;
        margin-top: 16px;
        color: #24292f;
        page-break-after: avoid;
    }}
    p, li {{
        color: #24292f;
    }}
    table {{
        border-collapse: collapse;
        width: 100%;
        margin: 14px 0;
        font-size: 9.5pt;
        page-break-inside: avoid;
    }}
    th, td {{
        border: 1px solid #d0d7de;
        padding: 7px 10px;
        text-align: left;
    }}
    th {{
        background-color: #f6f8fa;
        font-weight: 600;
        color: #1f2328;
    }}
    tr:nth-child(even) {{
        background-color: #fcfcfc;
    }}
    code {{
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 9pt;
        background-color: #eff1f3;
        padding: 2px 5px;
        border-radius: 4px;
    }}
    pre {{
        background-color: #f6f8fa;
        border: 1px solid #d0d7de;
        border-radius: 6px;
        padding: 10px;
        overflow-x: auto;
        font-size: 9pt;
        page-break-inside: avoid;
    }}
    pre code {{
        background-color: transparent;
        padding: 0;
    }}
    blockquote {{
        margin: 12px 0;
        padding: 6px 14px;
        color: #57606a;
        border-left: 4px solid #0969da;
        background-color: #f6f8fa;
    }}
    hr {{
        height: 1px;
        background-color: #d0d7de;
        border: none;
        margin: 18px 0;
    }}
    .diagram-box {{
        background-color: #f8f9fa;
        border: 1px solid #d0d7de;
        border-left: 4px solid #0969da;
        border-radius: 6px;
        padding: 12px 16px;
        margin: 14px 0;
        font-family: "SFMono-Regular", Consolas, monospace;
        font-size: 9pt;
        line-height: 1.5;
        white-space: pre-wrap;
        page-break-inside: avoid;
    }}
</style>
</head>
<body>
{content}
</body>
</html>
"""

def preprocess_mermaid(md_text):
    pattern = r"```mermaid\s*\n(.*?)\n```"
    def replace_mermaid(match):
        code = match.group(1).strip()
        return f'<div class="diagram-box"><strong>📊 Diagram Alur:</strong>\n{code}</div>'
    return re.sub(pattern, replace_mermaid, md_text, flags=re.DOTALL)

def md_to_pdf(md_file, pdf_file):
    print(f"Processing {md_file} -> {pdf_file}...", flush=True)
    with open(md_file, "r", encoding="utf-8") as f:
        text = f.read()

    text = preprocess_mermaid(text)
    
    md = markdown.Markdown(extensions=[
        'tables',
        'fenced_code',
        'toc',
        'nl2br'
    ])
    html_body = md.convert(text)

    title_match = re.search(r"<h1>(.*?)</h1>", html_body)
    title = title_match.group(1) if title_match else os.path.basename(md_file)

    full_html = HTML_TEMPLATE.format(title=title, content=html_body)

    html_file = md_file.replace(".md", "_temp.html")
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(full_html)

    abs_html = os.path.abspath(html_file)
    abs_pdf = os.path.abspath(pdf_file)

    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--print-to-pdf-no-header",
        f"--print-to-pdf={abs_pdf}",
        f"file:///{abs_html.replace('\\', '/')}"
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(html_file):
        os.remove(html_file)
        
    if os.path.exists(abs_pdf):
        size_kb = os.path.getsize(abs_pdf) / 1024
        print(f"SUCCESS: {pdf_file} created ({size_kb:.1f} KB)", flush=True)
    else:
        print(f"ERROR creating {pdf_file}: {res.stderr}", flush=True)

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    context_dir = os.path.abspath(os.path.join(script_dir, ".."))
    
    files = [
        (os.path.join(context_dir, "notulensi", "notulensi-PRD.md"), os.path.join(context_dir, "notulensi", "notulensi-PRD.pdf")),
        (os.path.join(context_dir, "notulensi", "notulensi-TM2.md"), os.path.join(context_dir, "notulensi", "notulensi-TM2.pdf")),
        (os.path.join(context_dir, "notulensi", "notulensi-AI.md"), os.path.join(context_dir, "notulensi", "notulensi-AI.pdf")),
        (os.path.join(context_dir, "proposal_and_survey", "Rencana_Survey_Activities_Pak_Sibuk_Ga.md"), os.path.join(context_dir, "proposal_and_survey", "Rencana_Survey_Activities_Pak_Sibuk_Ga.pdf"))
    ]
    for md_f, pdf_f in files:
        if os.path.exists(md_f):
            md_to_pdf(md_f, pdf_f)
        else:
            print(f"File not found: {md_f}")
