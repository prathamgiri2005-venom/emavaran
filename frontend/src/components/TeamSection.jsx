import React from "react";

// Add new people here. Photos go in frontend/public/team/ and are
// referenced as "/team/<file name>".
const TEAM = [
  {
    name: "Manvi Giri",
    role: "Co-Founder, Counseling Psychologist & Mental Health Advocate",
    photo: "/team/manvi-giri.jpg",
    highlights: [
      "Emotional Regulation",
      "Self-Esteem",
      "Life Skills Training",
      "Personal Growth",
      "Stress Management",
    ],
    bio: [
      "Manvi Giri is a dedicated and empathetic Counseling Psychologist with over two years of experience in supporting the emotional and psychological well-being of individuals across diverse settings. With a Master\u2019s degree in Counseling Psychology and extensive experience in private practices, NGOs, and schools, she works closely with adults and adolescents navigating a range of emotional and developmental challenges.",
      "Her therapeutic approach is client-centered and strengths-based, focusing on creating a safe, supportive, and non-judgmental space for individuals to explore their thoughts and emotions. She integrates practical techniques and evidence-based strategies to foster self-awareness, emotional regulation, and resilience.",
      "Her work includes addressing concerns such as emotional regulation, self-esteem, peer relationships, and stress management. As a Life Skills Trainer, she designs and facilitates engaging sessions that focus on building self-belief, communication skills, problem-solving abilities, and emotional strength.",
      "She is also experienced in psychoeducation and workshop facilitation, conducting interactive sessions for adults on themes such as self-confidence, emotional well-being, boundaries, and personal growth. Her approach emphasizes creating a safe and empowering space where individuals can express themselves freely.",
    ],
    quote:
      "As the co-founder of Emavaran, Manvi is committed to making mental health support accessible, relatable, and impactful. Her work is guided by empathy, authenticity, and a deep commitment to fostering growth, resilience, and meaningful change.",
  },
  {
    name: "Diksha Mago",
    role: "Co-Founder, Counseling Psychologist & Expressive Art Therapist",
    photo: "/team/diksha-mago.jpg",
    highlights: [
      "Master\u2019s in Counselling Psychology",
      "PG Diploma in Psychological Counseling",
      "Expressive Art Therapy",
      "Workshop facilitator",
    ],
    bio: [
      "Diksha Mago is a compassionate and dedicated Counseling Psychologist with a strong foundation in evidence-based therapeutic practices, around 2 years of experience and a deep commitment to emotional well-being. With a Master\u2019s degree in Counselling Psychology and PG Diploma in Psychological Counseling along with extensive experience across clinical, rehabilitation, and community settings, she supports individuals navigating a wide range of emotional and psychological challenges.",
      "Her therapeutic approach is integrative and client-centered, drawing from Cognitive Behavioral Therapy (CBT), Gestalt Therapy, Emotion-Focused Therapy, and Expressive Art Therapy. She creates a safe, non-judgmental space where individuals can explore their thoughts and emotions, build self-awareness, and develop healthier coping mechanisms.",
      "Diksha has worked with diverse populations, including children with special needs, individuals in rehabilitation settings, and adolescents in shelter homes\u2014providing individual, group, workshops and family counseling. She is also experienced in Expressive Art Therapy, using creative techniques like drawing, painting, music, movement, storytelling and reflective exercises to facilitate emotional expression and healing.",
      "As a workshop facilitator, she conducts interactive and experiential sessions on emotional strength, self-expression, stress management, and mental health awareness, helping participants engage with their inner experiences in meaningful and practical ways.",
    ],
    quote:
      "Being a co-founder of Emavaran, she contributes to promoting accessible and impactful mental health support. Her work is rooted in empathy, creativity, and a genuine commitment to helping individuals move toward healing, growth, and self-discovery.",
  },
  {
    name: "Shruti Goswami",
    role: "Therapist-in-Training",
    photo: "/team/shruti-goswami.jpg",
    highlights: [
      "MSc Counselling Psychology, CHRIST University",
      "100+ hours of individual counselling",
      "Offers pro bono sessions at Emavaran",
    ],
    bio: [
      "Shruti Goswami is a Therapist-in-Training at Emavaran, currently pursuing her MSc in Counselling Psychology at CHRIST University, where she also completed her bachelor\u2019s degree in Psychology, Sociology, and English. With over five years of academic training in psychology and more than 100 hours of individual counselling experience, she brings both academic knowledge and practical exposure to her work.",
      "Her experience includes working as a School Trainee Counsellor at RKG Global School, Ghaziabad, and completing a three-month internship at The Grey Couch. At Emavaran, Shruti contributes to making mental health support more accessible by offering pro bono counselling sessions and supporting the planning, coordination, and management of events.",
      "Her dedication to the field, collaborative spirit, and commitment to psychological well-being make her a valued member of the team.",
    ],
  },
  {
    name: "Hemant Tyagi",
    role: "Social Media & Visual Content Partner",
    photo: "/team/hemant-tyagi.jpg",
    highlights: [
      "12 years of experience",
      "Photographer, videographer and video editor",
      "Joins our events, workshops and retreats",
    ],
    bio: [
      "With 12 years of experience in the field, Hemant Tyagi is a professional photographer, videographer, and video editor who brings Emavaran\u2019s experiences to life through compelling visual storytelling.",
      "As an integral part of the Emavaran team, he accompanies us on events, workshops, and retreats, capturing authentic moments through photographs and raw video footage. From filming and editing content to managing and supporting our social media presence, Hemant plays a vital role in documenting our journey and communicating our work to a wider audience.",
      "His creative eye, technical expertise, and ability to capture the essence of every experience help us preserve meaningful moments and share the heart of Emavaran with the world.",
    ],
  },
  {
    name: "Pratham Goswami",
    role: "Developer & Technical Partner",
     photo: "/team/pratham-goswami.jpg",
    highlights: [
      "B.Tech in Computer Science and Engineering",
      "Freelance full-stack developer",
      "Built and maintains the Emavaran website",
    ],
    bio: [
      "Pratham is the Developer & Technical Partner at Emavaran, a B.Tech Computer Science and Engineering student and freelance full-stack developer who builds web platforms that work reliably for real people. He has designed, deployed, and maintained live client-facing web applications, taking each one from the first idea through to launch and ongoing support.",
      "At Emavaran, Pratham built and looks after the website that connects the community to its services. This includes the booking and contact system, the admin dashboard, and the hosting behind it, so that reaching out for support is simple and dependable.",
      "His problem-solving mindset, attention to detail, and commitment to making mental health support easier to find and access make him a valued part of the team.",
    ],
  },
];

const css = `
.team-section { padding: 72px 20px; background: #f6f4f1; color: #2b2a33; }
.team-inner { max-width: 1040px; margin: 0 auto; }
.team-heading { font-size: clamp(1.8rem, 4vw, 2.5rem); line-height: 1.15; margin: 0 0 12px; font-weight: 600; }
.team-intro { max-width: 56ch; font-size: 1.05rem; line-height: 1.6; margin: 0 0 48px; color: #555360; }
.team-member { display: grid; grid-template-columns: 340px 1fr; gap: 48px; align-items: start; padding: 40px 0; border-top: 1px solid #d9d5ce; }
.team-photo { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 6px; display: block; background: #dcd8d1; }
.team-name { font-size: 1.6rem; margin: 0 0 4px; font-weight: 600; }
.team-role { margin: 0 0 20px; font-size: 1rem; color: #5b5a8a; font-weight: 500; }
.team-highlights { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-wrap: wrap; gap: 8px; }
.team-highlights li { font-size: 0.875rem; padding: 6px 12px; border: 1px solid #c9c5d8; border-radius: 999px; background: #fff; }
.team-bio p { margin: 0 0 14px; line-height: 1.7; font-size: 1rem; max-width: 62ch; }
.team-quote { margin: 20px 0 0; padding-left: 16px; border-left: 3px solid #c9c5d8; font-style: italic; line-height: 1.7; max-width: 62ch; color: #444250; }
@media (max-width: 760px) {
  .team-section { padding: 48px 16px; }
  .team-member { grid-template-columns: 1fr; gap: 24px; }
  .team-photo { max-width: 320px; }
}
`;

export default function TeamSection() {
  return (
    <section className="team-section" aria-labelledby="team-heading">
      <style>{css}</style>
      <div className="team-inner">
        <h2 id="team-heading" className="team-heading">Meet our team</h2>
        <p className="team-intro">
          The people behind Emavaran, working to make mental health support
          more accessible.
        </p>

        {TEAM.map((m) => (
          <article className="team-member" key={m.name}>
            <img
              className="team-photo"
              src={m.photo}
              alt={`Portrait of ${m.name}`}
              loading="lazy"
            />
            <div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role">{m.role}</p>
              <ul className="team-highlights">
                {m.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="team-bio">
                {m.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {m.quote && (
                <blockquote className="team-quote">
                  {"\u201C"}
                  {m.quote}
                  {"\u201D"}
                </blockquote>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
