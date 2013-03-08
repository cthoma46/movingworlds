PUBLIC_DIR= ./public

all:
	stylus --compress views/style/blog.styl --out ${PUBLIC_DIR}/style
	stylus --compress views/style/main.styl --out ${PUBLIC_DIR}/style
