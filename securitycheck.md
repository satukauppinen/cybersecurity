| ISSUE | HOW WAS IT FOUND | HOW SHOULD IT WORK/HOW TO FIX |
| Content Security Policy | It comes up in ZAP and when viewing the developer tools in browser | Ideally, there would be no alerts. <br/> I need to keep on updating the CSP.|
| Cross-Site Scripting | Comes up in ZAP | Need to add a framework that provides protection agains XSS|
| No session expiration time | I was comparing my code to the one provided by teacher | I should set a timeout. <br/> It is supposed to minimize the time a possible attacker can launch attacks over active sessions.|
| Password security| I asked AI is the password protection good enough, it said no| I am using bcrypt for hashing the passwords but salt rounds could be added to make it stronger|
| Admin rights| It was mentioned on the lecture, also noticed it myself| Not everyone should be able to choose admin as their role.|
| Age | Noticed it myself | People can lie about their age. <br/> In real life there should be a strong authentication, not just writing down your age. | 