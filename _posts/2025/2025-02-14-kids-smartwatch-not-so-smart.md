---
image: /static/2025/kids-smartwatch.webp
---

# SmartWatch for Children - Not so Smart

In 2016, I decided to try a watch for my kid with GPS and the ability to call pre-defined numbers. One fateful evening, after about a year of usage, I called their support and asked them to locate the watch. I was beyond surprised when they could pinpoint within meters of where the watch might be. Probing further, I realized they have their servers somewhere in the underbelly of Andheri (East), Bombay. I know those places; those were the places I started my professional career, and I remember spending countless evenings sipping tea from the local street vendors there. That was when I decided never to trust these services and stopped using them.

> These watches are made in China, resold, and serviced by local Indian companies.

Of course, your cell phone service providers know your exact locations while you use a phone. Your smartphone Operating System (iOS, Android) providers and manufacturers also know almost all the details of what you have on your phone—from locations to your browsing habits to the places you go out to eat, your office, and your home.

Fortunately, phone service providers need strict legal orders from authorities to hand over your data to anyone asking for it. Next, your Operating System providers are primarily incentivized **NOT** to share your details and need almost similar legal orders to hand over the data to any third-party entity. Let’s assume, in good faith, that these entities (the phone service providers, the phone operating systems, and the phone manufacturers) are the better of the worst-case scenarios. There are many stories, anecdotes, and conspiracy theories about them, too, but let’s leave that for another day and discussion.

That leaves third-party companies selling Smartwatches, especially for kids, that track their every location, listen to the talks, and record everything. By installing their apps, wearing the watch, and “agreeing” to their Terms of Service and Privacy Policy, you gave everything away—bypassing any security sandbox your phone’s operating system might impose on such apps.

![A dystopian future where AI shepherds children](/static/2025/ai-kids-smartwatch.webp)

## AI

We are seeing AI-enabled scams a lot more these days. AI voices that can mimic anyone are at the disposal of scammers.

- What if someone calls you in your kid’s voice, asking to pick them up from somewhere someone spoofed their GPS.
- Or the Smartphone’s server data got leaked (even if unintentionally), and the entire time series of your kids’ movement, locations of interest, and where they usually go goes to people with bad intentions.

These are hypothetical and bare-minimal incidents that can and might happen. A lot worse can come out of this lethargic and insecure method of strapping a digital tether to your kids with a device that can pinpoint their location within meters, listen to their voices every second, and track their whereabouts.

## Smartwatches with Call/GPS Features

Children’s smartwatches are often marketed as a way for parents to stay connected with their children and track their locations for safety reasons. Core functionalities commonly include:

- Real-time GPS location tracking.
- Two-way calling or limited call options to predefined numbers.
- Messaging or chat features.
- Emergency/SOS alerts.

Most companies selling these Smartwatches and the associated services are ill-equipped, lack resources, and are not keen on extending their budget for the appropriate security measures.

## Insecure Communication Channels

Many children’s smartwatches rely on mobile apps to communicate location, messages, and voice data to a backend server.

- The **connections are unencrypted**, where data is sent over `HTTP` instead of `HTTPS`, risking exposure of location and personal details to anyone intercepting traffic.
- Their **encryption is weak or no encryption at rest**, and many models store location data and user information in plain text on unsecured servers.

The Norwegian Consumer Council’s 2017 “WatchOut” [report highlighted insecure communication channels](https://consumerfed.org/wp-content/uploads/2017/10/watchout-report.pdf) (PDF) in several popular kids’ smartwatches. One watch, when transmitting location coordinates, did not use robust SSL/TLS, making the data vulnerable to interception.

## Authentication and Authorization

Smartwatches and their companion apps often suffer from inadequate authentication checks. 

- Having **default or hard-coded passwords** (e.g., “123456”) is common, which users rarely change.
- **Weak session handling:** Tokens may not expire properly, allowing an attacker to reuse session tokens and access user data.
- **Missing server-side checks:** Certain backends do not verify that the person requesting data actually owns the device.

Security researchers at Pen Test Partners [discovered multiple watches](https://www.pentestpartners.com/security-blog/gps-watch-issues-again/) (including some generic models sold under different brand names) that allowed hackers to take over user accounts via poorly implemented password reset functions.

## GPS Spoofing or Replay Attacks

As these smartwatches’ GPS data are often transmitted without strong encryption or integrity checks, adversaries can:

- Intercept location signals and replay old data, causing false location reporting.
- Spoof GPS coordinates by injecting fraudulent location data onto insecure endpoints.

In the Forbrukerrådet (Norwegian Consumer Council) tests, they found that an attacker could manipulate location data and effectively “move” a child’s reported location to another place by sending crafted requests to the backend.

## Vulnerable Companion Apps

The smartphone apps that parents use to track and communicate with their children often have:

- Excessive permissions (e.g., microphone, contacts, camera, SMS) are not all strictly required.
- Insecure data storage in local databases, especially on Android devices.
- Overly broad third-party SDK integrations (e.g., analytics or advertising libraries that collect user data).

If a phone is compromised or the app developer's servers are breached, these vulnerabilities can lead to unauthorized access and data exfiltration.

## Privacy

Many children’s smartwatch vendors do not clearly outline:

- What personal data is collected (e.g., name, age, location history, voice recordings)?
- How long is data retained, and where is it stored?
- Whether data is shared with third-party advertisers or analytics services.

In some instances, families and regulators have found that data collected via children’s watches was stored in cloud servers in foreign jurisdictions with lax data protections, raising compliance questions under GDPR (in the EU) or COPPA (in the US).

## India

India has a bigger problem with a lack of checks and balances regarding security and privacy, which extends to enforcement. The burgeoning rise of scams powered by technologies, including AI-enabled ones, is rampant with no immediate respite in sight. India does not have a dedicated child online privacy law akin to the [Children’s Online Privacy Protection Act](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act) (COPPA) in the U.S. or the strict requirements under the [European Union’s GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) (especially its child-specific provisions).

- **Proliferation of Low-Cost and Unbranded Devices**
	- India’s large consumer market and price-sensitive segments often rely on imported or locally assembled kids’ smartwatches sold under various brand names (or sometimes no brand at all).
	- Many are rebranded Chinese models, frequently using the same firmware and companion apps with documented security flaws in other countries.
- **Easy Access to Online Stores**
	- Online marketplaces (Flipkart, Amazon, etc.) feature numerous kids’ smartwatch listings.
	- Reviews and product descriptions frequently emphasize features like GPS tracking, voice calls, and “parental monitoring” but often omit security or data protection details.
- **Lack of Consumer Awareness**
	- Parents may prioritize cost and basic safety functionalities (e.g., SOS calls and location tracking) over stringent privacy or data security features.
	- Technical details or disclaimers about data handling (if present at all) are often minimal.
- **Low Regulatory Enforcement**
	- Even with the [Digital Personal Data Protection Act](https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Act,_2023), consumer complaints about data misuse or security breaches often had limited recourse.
	- Enforcement bodies such as [CERT-In](https://en.wikipedia.org/wiki/Indian_Computer_Emergency_Response_Team) (Indian Computer Emergency Response Team) do address cybersecurity incidents but rarely investigate child-specific data privacy vulnerabilities in wearable devices.

## Alternatives

When parents shop for a children’s smartwatch, they often look for a balance between connection (e.g., the ability to call or message their child) and safety (e.g., location tracking). Unfortunately, many kid-focused smartwatches can introduce significant privacy and security risks—especially cheaper models with insufficient data protection.

Here are a few alternative approaches to help parents stay connected and ensure a child’s well-being without relying on a typical kids’ smartwatch.

- Non-smart “feature” phones (sometimes referred to as “dumb phones”) that offer calling and texting but lack internet browsing or advanced app functionality.
- A regular smartphone (Android or iPhone) with robust parental control apps or built-in settings that limit app installs, control screen time, and manage location sharing. You could lock it down to the basics - no social media, no video, etc. but enable the GPS and phone calls.
- Apple Watch or similar with Family Setup so that a child can wear a Watch without having their own Phone. The watch is managed through a parent’s Phone. However, this is an expensive setup.
- AirTags or similar devices. They are not as accurate and real-time, but they are cheaper and good enough. AirTags excel at pinpointing the location of an item. If your primary concern is knowing where your child is in a specific context (e.g., a large gated community, a crowded amusement park, a large event), an AirTag attached to their backpack or clothing might be more suitable than a smartwatch designed for two-way communication.

Of course, the best is **not to tether your kids to a digital lease.** Ultimately, the best choice depends on your child’s age, maturity, and actual safety needs. For many families, alternatives like a simple phone, a well-managed family sharing plan, or a basic GPS tracker can offer peace of mind without the heightened data and security risks that plague many kids’ smartwatches.

---

## References

- **tim.sh (2025)** [Everyone knows your location: tracking myself down through in-app ads](https://timsh.org/tracking-myself-down-through-in-app-ads/), [read the interesting comments](https://news.ycombinator.com/item?id=42909921) on Hacker News
- **Kinzoo (2023)** [The pros and cons of smartwatches for children](https://www.kinzoo.com/blog/the-pros-and-cons-of-smartwatches-for-children)
- **Bleeping Computer (2021)** [Smartwatches for children are a privacy and security nightmare](https://www.bleepingcomputer.com/news/security/smartwatches-for-children-are-a-privacy-and-security-nightmare/)
- **The Markup (2021)** [The Popular Family Safety App Life360 Is Selling Precise Location Data on Its Tens of Millions of Users](https://themarkup.org/privacy/2021/12/06/the-popular-family-safety-app-life360-is-selling-precise-location-data-on-its-tens-of-millions-of-user)
- **Wired (2020)** [Kids' Smartwatches Are a Security Nightmare Despite Years of Warnings](https://www.wired.com/story/kid-smartwatch-security-vulnerabilities/)
- **TechCrunch (2019)** [Over 2 Million Kids’ GPS Watch Records Left Exposed](https://techcrunch.com/2019/12/18/cloud-flaws-millions-child-watch-trackers/)
- **Bitdefender (2019)** [Kids’ Smartwatch Pulled off EU Market for Data Privacy Risks](https://www.bitdefender.com/en-gb/blog/hotforsecurity/kids-smartwatch-pulled-off-eu-market-data-privacy-risks)
- **Hunton (2019)** [EU Recalls Children's Smartwatch Over Security Concerns](https://www.hunton.com/privacy-and-information-security-law/eu-recalls-childrens-smartwatch-over-security-concerns)
- **News for Kids (2019)** [Children’s Smartwatches Can Be Dangerous](https://newsforkids.net/articles/2019/02/17/childrens-smartwatches-can-be-dangerous/)
- **Security Today (2019)** [Millions of Children-Tracking Smartwatches Are At Risk Of Being Hacked](https://securitytoday.com/articles/2019/12/20/millions-of-smartwatches-are-at-risk-of-being-hacked.aspx)
- **NextTV (2017)** [Smartwatches Can Endanger Kids](https://www.nexttv.com/news/groups-ftc-smartwatches-can-endanger-kids-415990)
- **Forbrukerrådet (2017)** [Significant security flaws in smartwatches for children](https://www.forbrukerradet.no/side/significant-security-flaws-in-smartwatches-for-children/)
- **TechCrunch (2017)** [Consumer report warns over safety of kids’ smartwatches](https://techcrunch.com/2017/10/19/consumer-report-warns-over-safety-of-kids-smartwatches/)