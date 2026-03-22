module.exports = {
  HRV2: {
    name: "Hemorrhagic Rabies Variant (HRV-2)",
    transmission: [
      "Bite Wounds",
      "Saliva contact with open wounds",
      "Scavenging infected carcasses"
    ]
  },

  HRV_DELTA: {
    name: "Hemorrhagic Rabies Variant (HRV-Δ)",
    transmission: [
      "Bite wounds",
      "Blood contact",
      "Feeding on infected carcass",
      "Grooming open wounds"
    ]
  },

  SAURO_OSTEO: {
    name: "Osteomyelitis",
    type: "Bacterial bone infection",
    species: ["sauropod"],

    cause: [
      "Traumatic injuries (combat wounds, falls, predator bites)",
      "Open fractures",
      "Deep puncture wounds",
      "Spread from nearby infected tissue"
    ],

    affectedBones: [
      "Vertebrae",
      "Ribs",
      "Limb bones (femur, humerus)",
      "Tail vertebrae"
    ],

    symptoms: [
      "Lameness or difficulty walking",
      "Pain when bearing weight",
      "Reduced mobility",
      "Lethargy",
      "Confusion"
    ],

    behavior: [
      "Reduced travel distance with the herd",
      "Preference for resting or standing still",
      "Increased vulnerability to predators",
      "Slower feeding movements",
      "Falling behind migrating herds",
      "Reduced reproductive success"
    ],

    transmission: [
      "Not contagious",
      "Develops from infected wounds or injuries"
    ],

    severity: [
      "Stage 1: Bone pain, slight movement discomfort",
      "Stage 2: Bone necrosis, increased resting, reduced speed",
      "Stage 3: Extreme bone weakness, high fracture risk"
    ],

    notes: "Sauropods may survive for extended periods with this condition.",
    credit: "Crimson"
  }
};