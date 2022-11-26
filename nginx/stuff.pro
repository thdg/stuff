server {
	listen 80;
	server_name xn--orsteinn-o6a.is;
	return 301 https://$host$request_uri;
}

server {
	listen 443 ssl;
	server_name xn--orsteinn-o6a.is;

	ssl_certificate /etc/letsencrypt/live/xn--orsteinn-o6a.is/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/xn--orsteinn-o6a.is/privkey.pem;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';



	root /home/services/stuff/public_html;

	index index.html index.htm;

	location / {
	}

	location /wordl {
		auth_basic "Nothing to see here...";
	        auth_basic_user_file /etc/nginx/.htpasswd;

		alias /home/services/wordl;
		index index.html;
	}

	location /api/ornefni/ {
		# Proxy
		rewrite /api/ornefni/(.*) /$1 break;
		proxy_set_header Host $http_host;
		proxy_set_header X-Forwarded-Host $server_name;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_pass	http://localhost:8484/;
	}

        location /gistinattaskyrslur/ {
                # Proxy
                rewrite /gistinattaskyrslur/(.*) /$1 break;
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-Host $server_name;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_pass      http://localhost:5000/;
        }

        location /krossgatur/ {
                # Proxy
                rewrite /krossgatur/(.*) /$1 break;
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-Host $server_name;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_pass      http://localhost:5001/;
        }
}
