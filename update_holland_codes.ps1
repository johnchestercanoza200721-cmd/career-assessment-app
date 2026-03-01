$filePath = "c:\Users\jccan\Desktop\𝗟𝗶𝗯𝗿𝗮𝗿𝘆\Coding Projects\Career Assessment Platform\views\results.ejs"
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

# Replace R (Realistic)
$oldR = "You're happiest when you're working with your hands and seeing real results. Whether you're fixing, building, or exploring the outdoors, you prefer concrete challenges over abstract theories. You're practical, down-to-earth, and the person everyone calls when something actually needs to get done."
$newR = "You're definitely someone who learns by doing. Psychologically, having a `"Realistic`" orientation just means you're hardwired to work with your hands, tools, or the physical world. Research on this type shows you find way more satisfaction in fixing a tangible problem than sitting through a theoretical lecture. You're practical, you value technical skill, and you're at your best when you can actually see the literal results of your hard work."
$content = $content -replace [regex]::Escape($oldR), $newR

# Replace I (Investigative)  
$oldI = "You're the person who always asks `"why?`" Driven by curiosity, you love diving deep into a topic and solving complex puzzles. You're an independent thinker who values facts and logic, and you'd much rather spend an afternoon researching a new idea than following a boring routine."
$newI = "You're the type of person who needs to know how the world works. Vocational studies label this the `"Investigative`" type because you're driven by logic and a deep-seated curiosity. You'd rather spend hours solving a complex puzzle or analyzing data than leading a crowd or doing repetitive tasks. You're an independent thinker who trusts the scientific method, and you really thrive when you can dive into a research rabbit hole."
$content = $content -replace [regex]::Escape($oldI), $newI

# Replace A (Artistic)
$oldA = "Rules and repetitive tasks aren't really your thing—you'd rather follow your intuition. You're expressive, original, and see the world through a unique lens. Whether you're designing, writing, or reimagining a space, you thrive in environments where your imagination can run wild."
$newA = "You have an `"Artistic`" personality, which in psychology means you're naturally drawn to things that are `"unstructured.`" You probably hate following a rigid handbook and would much rather use your intuition to create something original. Research says you value aesthetics and independence way more than the average person. You aren't just being `"rebellious`"—you're actually at your most productive when you have the freedom to reimagine how things look and feel."
$content = $content -replace [regex]::Escape($oldA), $newA

# Replace S (Social)
$oldS = "You're all about the human connection. You have a natural gift for understanding people and a genuine desire to see others succeed. Whether you're teaching, counseling, or just being a great friend, you're at your best when you're making a positive impact on someone's life."
$newS = "You have a `"Social`" profile, which is backed by a lot of research into empathy and emotional intelligence. Essentially, you're motivated by people, not machines or data. You're a natural at understanding what others need and helping them get there. Whether it's teaching or counseling, you find your biggest `"wins`" in the growth of the people around you. You're the glue in a collaborative team because you're wired to foster community and well-being."
$content = $content -replace [regex]::Escape($oldS), $newS

# Replace E (Enterprising)
$oldE = "You've got the energy and the vision to lead the way. You're a natural at starting projects, influencing others, and taking risks to reach big goals. You're comfortable in the spotlight and thrive in fast-paced environments where your ambition and strategy can shine."
$newE = "You've got that `"Enterprising`" energy that vocational researchers link to leadership and ambition. You're a natural at persuading people and taking the lead on big projects. While some people shy away from the spotlight, you're comfortable taking risks and making the big calls to get a project across the finish line. You're less about the tiny technical details and more about the strategy it takes to turn a vision into a real success."
$content = $content -replace [regex]::Escape($oldE), $newE

# Replace C (Conventional)
$oldC = "You're the one who keeps everything running smoothly. You find a weirdly satisfying beauty in order, accuracy, and detail. You love clear systems and organized data, and you're the reliable person who catches the small things that everyone else misses."
$newC = "You're the `"Conventional`" type, which is actually the backbone of every successful system. Research shows you have a high aptitude for information processing—you see the patterns and details that everyone else misses. You find a genuine satisfaction in order, precision, and making sure things are done the right way. While others might thrive in chaos, you're the person who ensures the world actually stays on track and stays efficient."
$content = $content -replace [regex]::Escape($oldC), $newC

# Save the file
Set-Content -Path $filePath -Value $content -Encoding UTF8

Write-Host "File updated successfully!"
