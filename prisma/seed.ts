import prisma from "../lib/prisma";
import * as bcrypt from "bcryptjs";

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing data
  await prisma.admin.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.confession.deleteMany({});
  await prisma.surveyResponse.deleteMany({});
  await prisma.survey.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.testimonial.deleteMany({});

  console.log("Database cleaned.");

  // 2. Create Admin
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "password123", 10);
  const admin = await prisma.admin.create({
    data: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: hashedPassword,
    },
  });
  console.log(`Admin user created: ${admin.username}`);

  // 3. Create Categories
  const storiesCategory = await prisma.category.create({
    data: {
      name: "Student Stories",
      slug: "stories",
      description: "Authentic, raw, and validating narratives written by students who navigated deep academic and mental struggles.",
    },
  });

  const psychologyCategory = await prisma.category.create({
    data: {
      name: "Psychology Explained",
      slug: "psychology",
      description: "Demystifying the biological and psychological processes behind anxiety, stress, and isolation.",
    },
  });

  const initiativeCategory = await prisma.category.create({
    data: {
      name: "Campus Initiatives",
      slug: "initiatives",
      description: "Reporting on university projects, policy updates, and resources working to build safer campus environments.",
    },
  });

  console.log("Categories created.");

  // 4. Create Tags
  const tags = ["Burnout", "Anxiety", "Isolation", "Imposter Syndrome", "Recovery", "Self-Care", "Academic Pressure"];
  const tagRecords = await Promise.all(
    tags.map((tag) =>
      prisma.tag.create({
        data: {
          name: tag,
          slug: tag.toLowerCase().replace(/ /g, "-"),
        },
      })
    )
  );
  console.log("Tags created.");

  // 5. Create Articles (Student Stories & Psychology Explained)
  
  // Story 1: Marcus
  const story1Timeline = JSON.stringify([
    { time: "Sophomore Year", text: "Marcus secures a 4.0 GPA but begins waking up at 4:00 AM daily driven by panic of failing." },
    { time: "Junior Year (Fall)", text: "Withdraws from social circles. Replaces exercise and dinners with library cram sessions." },
    { time: "Junior Year (Winter)", text: "Experiences his first panic attack in a chemistry lab, hiding in a bathroom stall." },
    { time: "Senior Year (Fall)", text: "A failed mock exam triggers complete emotional collapse. Confides in an advisor." },
    { time: "Recovery Phase", text: "Learns to decouple self-worth from grades through cognitive behavioral therapy." }
  ]);

  const story1Coping = JSON.stringify([
    { title: "Box Breathing", text: "When panic triggers, inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. This resets the fight-or-flight nervous system." },
    { title: "Grades vs Worth Audit", text: "Write down three things you value about yourself that have nothing to do with academic performance or professional success." },
    { title: "Micro-Outreaches", text: "Text one friend just to say 'thinking of you'. It breaks the isolation loop without requiring exhausting social energy." }
  ]);

  const story1FAQ = JSON.stringify([
    { q: "What is high-functioning anxiety?", a: "High-functioning anxiety refers to individuals who experience significant internal anxiety but appear highly successful, organized, and calm on the outside." },
    { q: "How can I tell if my stress is becoming unhealthy?", a: "Warning signs include withdrawal from friends, obsessive worry over minor assignments, physical exhaustion, and relying on grades as your sole source of validation." }
  ]);

  await prisma.article.create({
    data: {
      title: "Behind the Perfect GPA: Marcus's Journey Through High-Functioning Anxiety",
      slug: "behind-the-perfect-gpa",
      excerpt: "On the outside, Marcus was the model student. On the inside, his academic drive was fueled by a debilitating, invisible fear of failure.",
      content: `Marcus always laughed when people called him a superstar. Double major, president of the chemistry society, 4.0 GPA, and a guaranteed slot in a prestigious lab. He was the student advisors held up as a standard.

But in the quiet hours of 4:00 AM, Marcus sat on his bathroom floor, waiting for his chest to stop tightening. His hands shook so violently he could barely hold his coffee. To the campus, he was thriving. To himself, he was a single bad grade away from complete annihilation.

### The Invisible Weight

High-functioning anxiety is an insidious experience because it is actively reinforced by our systems. Every time Marcus stayed up for 36 hours straight to polish a paper, he received an "A." The university rewarded his sleeplessness, his isolation, and his obsessive perfectionism.

"I felt like an imposter," Marcus recalls. "I thought if I didn't get perfect grades, everyone would realize I didn't belong here. I associated my entire value as a human being with the red ink at the top of a exam paper."

As winter set in, the strategy failed. During a mid-term exam, Marcus stared at a question he couldn't immediately solve. The room began to spin. His breath caught in his throat. He ran out of the room, leaving his paper blank, and locked himself in a library stall. He couldn't breathe. It was his first panic attack.

### Reaching Out

The turning point came when Marcus failed to show up for a lab presentation. His advisor, noticing the sudden absence, reached out not with a reprimand, but with a simple question: *"How are you carrying all of this?"*

That simple question shattered Marcus's defense mechanism. For the first time, he admitted he was drowning. Through counseling, Marcus began the long process of rebuilding his identity outside of his achievements.

He learned that vulnerability is not a weakness, but a vital defense against the psychological isolation of academic pressure. Today, Marcus has his GPA, but he also has his life.`,
      readingTime: 6,
      status: "PUBLISHED",
      featuredImage: "/images/editorial_marcus.jpg",
      isStory: true,
      timeline: story1Timeline,
      copingStrategies: story1Coping,
      escalationExplanation: "High-functioning anxiety is heavily reinforced by external accolades. Marcus's coping mechanism was hyper-performance, which masked his underlying panic. Because his strategy worked to generate high grades, the underlying disorder was ignored until his biological limits were reached, triggering a somatic crisis (panic attack).",
      seoTitle: "High-Functioning Anxiety in College Students: Marcus's Story",
      seoDescription: "An editorial deep-dive into high-functioning academic anxiety. Learn how to spot warning signs and find coping mechanisms.",
      seoKeywords: "student anxiety, academic pressure, 4.0 gpa stress, mental wellness, college panic attack",
      faqSchema: story1FAQ,
      categoryId: storiesCategory.id,
      tags: {
        connect: [
          { id: tagRecords[1].id }, // Anxiety
          { id: tagRecords[6].id }, // Academic Pressure
          { id: tagRecords[3].id }, // Imposter Syndrome
        ]
      }
    }
  });

  // Story 2: Sarah
  const story2Timeline = JSON.stringify([
    { time: "First Month", text: "Sarah arrives on campus. Feels unable to relate to classmates who seem to have immediate friend groups." },
    { time: "Midterms", text: "Stays in her dorm room 20+ hours a day. Skips meals to avoid eating alone in the dining hall." },
    { time: "November", text: "Develops sleeping patterns where she sleeps through daytime classes, deepening her academic deficit." },
    { time: "December", text: "Discovers an anonymous support circle that matches her with peer listeners who validate her feelings." },
    { time: "Spring", text: "Joins campus affinity groups and begins sharing her story openly." }
  ]);

  const story2Coping = JSON.stringify([
    { title: "The 10-Minute Walk Rule", text: "Commit to leaving your room for just 10 minutes a day, regardless of destination. Exposure to light and nature disrupts depressive rumination." },
    { title: "Shared Silence", text: "Find a public but low-interaction study spot like a library. Being around others without pressure to speak helps rebuild social comfort." },
    { title: "Safe Self-Disclosure", text: "Share a minor vulnerability with a peer, e.g., 'I find it hard to settle in here.' Often, they will confess they feel the exact same way." }
  ]);

  await prisma.article.create({
    data: {
      title: "Finding My Voice: Reconnecting After Freshman Isolation",
      slug: "finding-my-voice",
      excerpt: "Sarah thought college would be the time of her life. Instead, she spent her first three months staring at the walls of her dorm room, unable to bridge the gap.",
      content: `The brochure promised a vibrant community, late-night conversations, and instant lifelong friendships. But when Sarah arrived, the noise of freshman orientation felt like a wall she couldn't climb.

While others seemed to form tight-knit squads within 48 hours, Sarah found herself eating dinner in a bathroom stall to avoid sitting alone in the dining hall. The isolation was physical, heavy, and silent.

### The Retreat

"Isolation is a spiral," Sarah explains. "You feel lonely, so you withdraw. But because you withdraw, you become lonelier. You start believing there is something fundamentally broken about you, that everyone else is playing a game you don't know the rules to."

By November, the walls of her dorm room felt like a cell. She started skipping morning lectures because the thought of walking into a crowded lecture hall alone made her stomach churn. Her grades slipped, which only added shame to her isolation.

### The Power of Shared Experience

The turning point was accidental. While scrolling through a campus forum late at night, she saw an anonymous post: *"I sit in my room listening to everyone else laugh in the hallway. I feel completely invisible."*

The post had dozens of comments. All saying: *"Me too."*

"It was a lightning bolt," Sarah says. "I wasn't the outlier. Half the people laughing in the hallways were probably terrified of going back to their empty rooms."

Sarah reached out to a peer support program. Step by step, she learned to tolerate the discomfort of initial interactions. Today, Sarah is an orientation leader. Her primary message to new students? "If you feel lonely, you are in the majority. Let's talk about it."`,
      readingTime: 5,
      status: "PUBLISHED",
      featuredImage: "/images/editorial_sarah.jpg",
      isStory: true,
      timeline: story2Timeline,
      copingStrategies: story2Coping,
      escalationExplanation: "Isolation thrives on shame and the cognitive distortion of uniqueness ('I am the only one feeling this'). Sarah's withdrawal was a defense mechanism to avoid the pain of rejection. It escalated because the physical layout of college dorms can facilitate complete physical isolation, making it easy to hide until academic performance collapses.",
      seoTitle: "Freshman Isolation & Loneliness: Sarah's Journey",
      seoDescription: "Overcoming freshman isolation in college. A student's honest story of fighting loneliness and building authentic community.",
      seoKeywords: "freshman isolation, college loneliness, making friends in college, student mental health",
      categoryId: storiesCategory.id,
      tags: {
        connect: [
          { id: tagRecords[2].id }, // Isolation
          { id: tagRecords[4].id }, // Recovery
        ]
      }
    }
  });

  // Psychology Article 1: Stress
  const psych1FAQ = JSON.stringify([
    { q: "What is cortisol?", a: "Cortisol is the body's primary stress hormone. It regulates glucose levels, increases brain activity, and controls responses in stressful environments." },
    { q: "How can I lower my cortisol levels during exams?", a: "Engaging in moderate physical activity, getting consistent sleep, practicing mindfulness, and taking breaks away from screens can rapidly reduce circulating stress hormones." }
  ]);

  await prisma.article.create({
    data: {
      title: "The Physiology of Academic Stress: Inside the Flight-or-Fight Response",
      slug: "physiology-of-academic-stress",
      excerpt: "Why does a final exam trigger the same evolutionary panic as running from a predator? Understanding the neuroscience of academic overload.",
      content: `Your palms are sweating. Your heart is hammering against your ribs. Your breathing is shallow, and your focus is locked on the paper in front of you. 

Biologically speaking, your brain doesn't know the difference between a Organic Chemistry final and a wolf leaping from the bushes. 

To understand why academic stress feels so physically exhausting, we have to look under the hood at the autonomic nervous system.

### The Evolutionary Hijack

When you perceive a high-stakes event—like a grading deadline or a public presentation—your **amygdala** (the brain's emotional radar) sounds an alarm. It signals the hypothalamus, which activates your sympathetic nervous system.

Within milliseconds, a cascade of hormones is released:
1. **Adrenaline**: Speeds up your heart rate, elevates your blood pressure, and boosts energy supplies.
2. **Cortisol**: The primary stress hormone, which increases glucose in the bloodstream and alters immune system responses.

This system is magnificent for short-term survival. It redirects blood flow away from non-essential functions (like digestion and the prefrontal cortex—your rational thinking brain) and into your muscles.

### The Modern Mismatch

Here is the problem: a semester lasts fifteen weeks. 

If you are constantly worrying about grades, your brain keeps the alarm system turned on. This is **chronic stress**. Because your prefrontal cortex is receiving less blood flow, your ability to retain information, problem-solve, and regulate emotions actually *decreases*.

"Studying harder when you are in fight-or-flight is biologically counterproductive," explains Dr. Elena Rostova, a cognitive neuroscientist. "Your brain is physically locked out of its creative and analytical mode."

### Downregulating the System

To study effectively, you must first signal to your body that it is safe.
- **Physical Sighs**: Double inhale through the nose, followed by a long, slow exhale through the mouth. This immediately triggers the vagus nerve to slow down the heart rate.
- **Somatic Grounding**: Feel your feet flat on the floor and describe five neutral objects in the room. This moves brain activity out of the amygdala and back into the sensory cortex.
- **Strategic Rest**: Sleep is not a reward for studying; it is the biological process by which memories are consolidated. Without sleep, the brain cannot write new information to disc.`,
      readingTime: 7,
      status: "PUBLISHED",
      featuredImage: "/images/editorial_science.jpg",
      isStory: false,
      escalationExplanation: null,
      seoTitle: "Academic Stress Neuroscience: Understanding Fight-or-Fight",
      seoDescription: "Why final exams trigger physical stress. Discover the neurology of academic anxiety and how to ground your nervous system.",
      seoKeywords: "academic stress, fight or flight, student brain, cortisol, science of anxiety",
      faqSchema: psych1FAQ,
      categoryId: psychologyCategory.id,
      tags: {
        connect: [
          { id: tagRecords[0].id }, // Burnout
          { id: tagRecords[1].id }, // Anxiety
          { id: tagRecords[5].id }, // Self-Care
        ]
      }
    }
  });

  // Psychology Article 2: Privacy
  await prisma.article.create({
    data: {
      title: "Why Privacy in Mental Support is Non-Negotiable for College Students",
      slug: "why-privacy-matters",
      excerpt: "Fear of academic records, parental notifications, and peer stigma keep millions of students silent. Here is why privacy-first support is critical.",
      content: `In a recent survey of undergraduate students experiencing moderate to severe anxiety, a striking 62% reported they had actively avoided seeking support services. 

Their primary reason? **Fear.**

Not fear of therapy, but fear of the *consequences* of seeking help. Fear that their records would leak, that their parents would receive notifications, or that a diagnosis would impact their academic standing.

### The Stigma of Records

For a student striving for medical school, law school, or high-finance careers, the perception of instability can feel like a professional death sentence. Many wrongly believe that visiting campus counseling will show up on their transcript or be disclosed during background checks.

Even when counselors explain confidentiality, the institutional setting (a clinical building in the middle of campus where peers can see you enter) acts as a physical barrier to entry.

### Why Privacy-First Systems Change the Equation

To break the barrier, support must be decentralized, anonymous, and user-controlled. 
1. **Low-friction exploration**: Students need to assess their symptoms without submitting their student ID number first.
2. **Encrypted boundaries**: Digital wellness tools must treat user logs as sacred and unshareable.
3. **Decoupled support**: Peer networks and wellness apps that sit outside the official university registrar build immediate trust.

By prioritizing privacy, we don't just protect data; we validate the student's agency. We allow them to explore their mental wellness at their own pace, free from the shadow of institutional surveillance.`,
      readingTime: 4,
      status: "PUBLISHED",
      featuredImage: "/images/editorial_privacy.jpg",
      isStory: false,
      seoTitle: "Student Privacy in Mental Health Support | Eternia Journal",
      seoDescription: "Why privacy is the single most important factor for college students seeking mental health care.",
      seoKeywords: "student privacy, mental wellness confidentiality, HIPAA college, anonymous support",
      categoryId: psychologyCategory.id,
      tags: {
        connect: [
          { id: tagRecords[2].id }, // Isolation
          { id: tagRecords[5].id }, // Self-Care
        ]
      }
    }
  });

  // Initiative Article 1: VIT Bhopal Hackathon
  await prisma.article.create({
    data: {
      title: "Eternia Secures 1st Position at VIT Bhopal Health Hackathon 2026: Building a Safer Space for Mental Wellness",
      slug: "eternia-secures-1st-position-at-vit-bhopal-health-hackathon-2026",
      excerpt: "Eternia achieved a remarkable milestone by securing 1st Position at the HealthHack 2026 held at VIT Bhopal. Competing against more than 1,700 teams, the Eternia team emerged as the overall winner with its innovative vision of creating a privacy-first platform for mental wellness.",
      content: `Eternia achieved a remarkable milestone by securing **1st Position at the HealthHack 2026 held at VIT Bhopal**. Competing against **more than 1,700 participating teams**, the Eternia team emerged as the overall winner with its innovative vision of creating a privacy-first platform for mental wellness.

This achievement reflects Eternia's commitment to solving real-world healthcare challenges through technology, innovation, and empathy. Winning among such a large number of participants demonstrates the platform's potential to create meaningful social impact.

### Innovation Recognized at Health Hackathon 2026

The HealthHack 2026 at VIT Bhopal brought together over **1,700 teams**, all working to develop innovative solutions for healthcare-related challenges. The competition showcased ideas from talented students, innovators, and aspiring entrepreneurs across diverse domains.

Among this highly competitive field, the Eternia team stood out with its vision of creating an anonymous and judgment-free digital platform where individuals can openly share their thoughts, emotions, and personal struggles without revealing their identity.

The team's innovative approach, strong problem-solving mindset, and commitment to addressing mental wellness challenges earned **Eternia the First Prize**, making it one of the standout success stories of the event.

### The Team Behind the Achievement

This achievement was made possible through the dedication and collaboration of the Team Eternia :

* **Priyanshi Rathore** — Team Leader
  Leading the vision, innovation strategy, and overall direction behind building Eternia as a privacy-first mental wellness platform.

* **Yash Khatik** — Team Member
  Contributing to the development and execution of the solution throughout the hackathon journey.

* **Gaurav Shah** — Team Member
  Supporting the team in refining, presenting, and demonstrating the innovative concept during the competition.

Together, the team transformed a meaningful idea into an award-winning solution that competed successfully against **more than 1,700 participating teams**, securing the **1st Prize** at VIT Bhopal Health Hackathon 2026.

### Conclusion

Winning the **HealthHack 2026** is more than just an award for Eternia—it is validation of the team's vision to create technology that puts people first.

By securing **1st Position among more than 1,700 competing teams**, Eternia demonstrated that innovation rooted in empathy and privacy can make a meaningful difference. This achievement marks an important milestone in Eternia's journey as it continues building a future where everyone has access to a safe, anonymous, and judgment-free space to seek support and express themselves.`,
      readingTime: 4,
      status: "PUBLISHED",
      featuredImage: "/images/editorial_hackathon.jpg",
      isStory: false,
      seoTitle: "Eternia Wins VIT Bhopal Health Hackathon 2026",
      seoDescription: "Eternia secures 1st position at VIT Bhopal Health Hackathon 2026 out of 1,700+ teams with its privacy-first mental wellness platform.",
      seoKeywords: "VIT Bhopal, HealthHack 2026, mental wellness, privacy-first, health hackathon winner",
      categoryId: initiativeCategory.id,
      tags: {
        connect: [
          { id: tagRecords[4].id }, // Recovery
          { id: tagRecords[5].id }, // Self-Care
        ]
      }
    }
  });

  console.log("Articles created.");

  // 6. Create Anonymous Confessions
  const confessions = [
    { content: "Everyone here seems to have their life completely sorted out. I feel like an imposter who got in by mistake.", campus: "Boston University", status: "APPROVED" },
    { content: "I haven't told my parents I failed my chemistry midterm. They sacrifice so much for me to be here. The weight is eating me alive.", campus: "Northeastern University", status: "APPROVED" },
    { content: "Campus counseling has a three-week waitlist. I had a panic attack today and didn't know who to call.", campus: "Harvard University", status: "APPROVED" },
    { content: "I pretend to be busy studying at the library every weekend just so my roommates think I have a social life. I'm actually just staring at the wall.", campus: "MIT", status: "APPROVED" },
    { content: "I am in a group project where no one answers my messages. I feel like I'm completely invisible on this campus.", campus: "Boston College", status: "PENDING" },
  ];

  await Promise.all(
    confessions.map((c) =>
      prisma.confession.create({
        data: c,
      })
    )
  );
  console.log("Confessions seeded.");

  // 7. Create Surveys
  const survey = await prisma.survey.create({
    data: {
      title: "Academic Pressure & Expression",
      description: "Have you ever felt like you couldn't share your mental struggles because of academic pressure or fear of academic consequences?",
      options: JSON.stringify(["Frequently", "Sometimes", "Rarely", "Never"]),
      isActive: true,
    },
  });

  // Seed response distributions
  const surveyResponses = [
    ...Array(42).fill("Frequently"),
    ...Array(56).fill("Sometimes"),
    ...Array(18).fill("Rarely"),
    ...Array(9).fill("Never"),
  ];

  await Promise.all(
    surveyResponses.map((option) =>
      prisma.surveyResponse.create({
        data: {
          surveyId: survey.id,
          selectedOption: option,
        },
      })
    )
  );
  console.log("Active Survey & Responses seeded.");

  // 8. Achievements & Testimonials
  const achievements = [
    { title: "Campus Integration Pilot", description: "Launched our privacy-first peer support system across 3 major Boston university areas.", date: "Fall 2025", metric: "3 Universities", category: "Campus" },
    { title: "Confidential Assessments", description: "Students completed anonymous mental health checkups, finding resources without registration.", date: "AY 2025-2026", metric: "15,000+ Completed", category: "Community" },
    { title: "Privacy Architecture Audit", description: "Eternia infrastructure verified as military-grade zero-knowledge encryption by external privacy audit.", date: "Spring 2026", metric: "100% Secure", category: "Eternia" },
  ];

  await Promise.all(
    achievements.map((a) =>
      prisma.achievement.create({
        data: a,
      })
    )
  );

  const testimonials = [
    { quote: "I felt like I was the only one failing. Reading these stories made me realize my anxiety is a physiological response, not a personal flaw.", authorName: "Marcus R.", authorRole: "Senior, Chemistry", approved: true },
    { quote: "The anonymous assessment allowed me to check in on my mental state without fear of it going onto my university record. It saved my semester.", authorName: "Sarah K.", authorRole: "Sophomore, Bio", approved: true },
  ];

  await Promise.all(
    testimonials.map((t) =>
      prisma.testimonial.create({
        data: t,
      })
    )
  );
  console.log("Achievements & Testimonials seeded.");

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
