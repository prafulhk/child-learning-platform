import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import { SubjectModel } from "../modules/catalog/models/subject.model.js";
import { TopicModel } from "../modules/catalog/models/topic.model.js";

interface SubjectSeed {
  name: string;
  code: string;
  description: string;
  category: "ACADEMIC";
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

const subjectSeeds: SubjectSeed[] = [
  {
    name: "Mathematics",
    code: "mathematics",
    description: "Core mathematics concepts and problem solving.",
    category: "ACADEMIC",
    sortOrder: 1,
    status: "ACTIVE",
  },
  {
    name: "English",
    code: "english",
    description: "English language and literacy skills.",
    category: "ACADEMIC",
    sortOrder: 2,
    status: "ACTIVE",
  },
  {
    name: "Science",
    code: "science",
    description: "General science concepts and exploration.",
    category: "ACADEMIC",
    sortOrder: 3,
    status: "ACTIVE",
  },
  {
    name: "Abacus",
    code: "abacus",
    description: "Abacus-based calculation and arithmetic technique.",
    category: "ACADEMIC",
    sortOrder: 4,
    status: "ACTIVE",
  },
  {
    name: "Reading",
    code: "reading",
    description: "Reading fluency and comprehension.",
    category: "ACADEMIC",
    sortOrder: 5,
    status: "ACTIVE",
  },
  {
    name: "Logical Reasoning",
    code: "logical-reasoning",
    description: "Logical thinking and reasoning skills.",
    category: "ACADEMIC",
    sortOrder: 6,
    status: "ACTIVE",
  },
  {
    name: "Mental Math",
    code: "mental-math",
    description: "Mental arithmetic and quick calculation.",
    category: "ACADEMIC",
    sortOrder: 7,
    status: "ACTIVE",
  },
];

async function seedSubjects(): Promise<void> {
  for (const subject of subjectSeeds) {
    await SubjectModel.findOneAndUpdate(
      { code: subject.code },
      { $set: subject },
      { upsert: true },
    );
  }

  console.log(`Seeded ${subjectSeeds.length} subjects:`);

  for (const subject of subjectSeeds) {
    console.log(`- ${subject.name} (${subject.code})`);
  }
}

interface TopicSeed {
  name: string;
  code: string;
  description: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

const topicSeeds: TopicSeed[] = [
  {
    name: "Single Digit Addition",
    code: "single-digit-addition",
    description: "Addition using single-digit numbers.",
    sortOrder: 1,
    status: "ACTIVE",
  },
  {
    name: "Single Digit Subtraction",
    code: "single-digit-subtraction",
    description: "Subtraction using single-digit numbers.",
    sortOrder: 2,
    status: "ACTIVE",
  },
  {
    name: "Two Digit Addition",
    code: "two-digit-addition",
    description: "Addition using two-digit numbers.",
    sortOrder: 3,
    status: "ACTIVE",
  },
  {
    name: "Two Digit Subtraction",
    code: "two-digit-subtraction",
    description: "Subtraction using two-digit numbers.",
    sortOrder: 4,
    status: "ACTIVE",
  },
];

async function seedAbacusTopics(): Promise<void> {
  const abacusSubject = await SubjectModel.findOne({
    code: "abacus",
  }).lean();

  if (!abacusSubject) {
    throw new Error(
      'Abacus subject was not found after subject seeding. Cannot seed topics.',
    );
  }

  for (const topic of topicSeeds) {
    await TopicModel.findOneAndUpdate(
      {
        subjectId: abacusSubject._id,
        code: topic.code,
      },
      {
        $set: {
          ...topic,
          subjectId: abacusSubject._id,
        },
      },
      {
        upsert: true,
      },
    );
  }

  console.log(`Seeded ${topicSeeds.length} Abacus topics:`);

  for (const topic of topicSeeds) {
    console.log(`- ${topic.name} (${topic.code})`);
  }
}

async function runSeed(): Promise<void> {
  await connectDatabase();
  await seedSubjects();
  await seedAbacusTopics();
  await mongoose.disconnect();
}

runSeed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
