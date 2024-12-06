SECURITY ISSUES

Content Security Policy

How it was found?: 
- It comes up in ZAP and when viewing the developer tools in browser.

How should it work/possible fix: 
- Ideally, there would be no alerts. 
- I need to keep on updating the CSP.



Cross-Site Scripting

How it was found?: 
- Comes up in ZAP

How should it work/possible fix: 
- Ideally, there would be no alerts. 
- Need to add a framework that provides protection agains XSS



No session expiration time

How it was found?: 
- I was comparing my code to the one provided by teacher.

How should it work/possible fix: 
- I should set a timeout. 
- It is supposed to minimize the time a possible attacker can launch attacks over active sessions.



Password security 

How it was found?: 
- I asked AI is the password protection good enough, it said no.

How should it work/possible fix: 
- I am using bcrypt for hashing the passwords but salt rounds could be added to make it stronger.



Admin rights

How it was found?: 
- It was mentioned on the lecture, also noticed it myself. 

How should it work/possible fix: 
- Not everyone should be able to choose admin as their role. 



Age 

How it was found?: 
- Noticed it myself.

How should it work/possible fix: 
- People can lie about their age. 
- In real life there should be a strong authentication, not just writing down your age. 