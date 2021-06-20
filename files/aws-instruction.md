## AWS

- `&Cugk2f$eR"(_38`

## SSH

ssh -i "projectforumreact.pem" ubuntu@ec2-3-133-160-207.us-east-2.compute.amazonaws.com

## Set timeout on SSH

Assuming your Amazon EC2 instance is running Linux (and the very likely case that you are using SSH-2, not 1), the following should work pretty handily:

Remote into your EC2 instance.

`ssh -i <YOUR_PRIVATE_KEY_FILE>.pem <INTERNET_ADDRESS_OF_YOUR_INSTANCE>`

Add a "client-alive" directive to the instance's SSH-server configuration file.

`echo 'ClientAliveInterval 60' | sudo tee --append /etc/ssh/sshd_config`

Restart or reload the SSH server, for it to recognize the configuration change.

The command for that on Ubuntu Linux would be..

`sudo service ssh restart`

On any other Linux, though, the following is probably correct..

`sudo service sshd restart`

Disconnect.

`logout`

The next time you SSH into that EC2 instance, those super-annoying frequent connection freezes/timeouts/drops should hopefully be gone.

This is also helps with Google Compute Engine instances, which come with similarly annoying default settings.

Warning: Do note that TCPKeepAlive settings (which also exist) are subtly, yet distinctly different from the ClientAlive settings that I propose above, and that changing TCPKeepAlive settings from the default may actually hurt your situation rather than help.

More info here: http://man.openbsd.org/?query=sshd_config

## Redis

Restart:

`sudo systemctl restart redis.service`

Stop:

`sudo systemctl stop redis.service`

Start:

`sudo systemctl start redis.service`

Status:

`sudo systemctl status redis`

## Connect to Postgres as forumsvc user

After the line enter password
`psql -U forumsvc -h 127.0.0.1 forumreact`
