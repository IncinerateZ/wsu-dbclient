import sys, os

def main():
    if(len(sys.argv) <= 1): return
    page = sys.argv[1]
    print('Making page ' + page)
    if(os.path.isdir(page)): return print('Page', page, 'Already Exists!')
    os.mkdir(page)
    open("./" + page + '/index.html', 'x')
    open("./" + page + '/index.js', 'x')
    open("./" + page + '/index.css', 'x')
    print('Page', page, "Created")


if __name__ == "__main__":
    main()