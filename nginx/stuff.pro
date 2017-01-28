server {
	listen 443 ssl;
	server_name xn--orsteinn-o6a.is;
	return 300 http://$host$request_uri;
}

server {
	listen 80;
	server_name þorsteinn.is xn--orsteinn-o6a.is;

	root /home/ubuntu/stuff/public_html;

	index index.html index.htm;
	
	location / {
	}
}

