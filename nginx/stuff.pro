server {
	listen 443 ssl;
	server_name xn--orsteinn-o6a.is;
	return 301 http://$host$request_uri;
}

server {
	listen 80;
	server_name xn--orsteinn-o6a.is;

	root /home/ubuntu/stuff/public_html;

	index index.html index.htm;

	location / {
	}

	location /api/ornefni/ {
		# Proxy
		rewrite /api/ornefni/(.*) /$1 break;
		proxy_pass	http://localhost:5000/;
	}
}
