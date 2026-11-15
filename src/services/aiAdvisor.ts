import { OutpostResources, SubsystemAllocations, DecisionLogEntry, MissionEvaluation } from '../types';

export interface AdvisorDialogue {
  id: string;
  sender: 'CAPCOM-AI' | 'User';
  text: string;
  type: 'urgent' | 'advice' | 'info' | 'science';
  timestamp: string;
}

export const FREQUENT_QUESTIONS = [
  {
    q: "Why is lunar dust so dangerous to our base?",
    category: "Geology & Engineering",
    answer: "Unlike Earth sand which is rounded by ocean waves and wind, Moon dust (regolith) has never felt wind or water! It's made of tiny shards of volcanic glass and pulverized rock with jagged razor edges. It clings to spacesuits like static cling on socks, damages seals, scratches solar panels, and can hurt astronauts' lungs if tracked inside!"
  },
  {
    q: "How does water protect astronauts from solar flares?",
    category: "Radiation Physics",
    answer: "Solar storms shoot billions of high-energy protons (cosmic radiation). Protons are the nuclei of hydrogen atoms. Water ($H_2O$) is packed with hydrogen atoms! When incoming solar protons slam into water molecules, they bump into particles of the exact same size, bouncing away and safely absorbing the radiation before it hits human cells. It works like billiard balls colliding!"
  },
  {
    q: "How do astronauts breathe on the Moon?",
    category: "Life Support (ECLSS)",
    answer: "The Moon has no atmosphere at all — it's a vacuum! The outpost uses an ECLSS (Environmental Control and Life Support System). It uses electrolysis (running electricity through water) to split $H_2O$ into breathable Oxygen ($O_2$) and Hydrogen. Astronauts also use a Sabatier reactor to recycle their exhaled $CO_2$ back into clean water and oxygen!"
  },
  {
    q: "What is NASA's DONKI system?",
    category: "Space Weather",
    answer: "DONKI stands for Space Weather Database Of Notifications, Knowledge, Information! NASA satellites like SDO and DSCOVR watch the Sun 24/7. When the Sun spits out a giant magnetic explosion (a Solar Flare or Coronal Mass Ejection), DONKI calculates its speed and sends an alert to mission controllers so astronauts can seek shelter before the radiation arrives!"
  },
  {
    q: "Can plants really grow in Moon soil?",
    category: "Space Botany",
    answer: "In 2022, NASA OSDR scientists planted Arabidopsis seeds in real Apollo Moon soil (regolith) for the very first time! The plants sprouted, but their genes showed signs of stress because lunar dirt lacks organic compost and nitrogen. In ASTRO COMMAND, our space greenhouse mixes lunar minerals with recycled water and LED grow-lights to produce nutritious fresh microgreens!"
  }
];

export function generateAdvisorAdvice(
  resources: OutpostResources,
  subsystems: SubsystemAllocations,
  sol: number
): AdvisorDialogue[] {
  const alerts: AdvisorDialogue[] = [];
  const timeStr = `Sol ${sol}`;

  // Check critical resources
  if (resources.oxygen.current < 25) {
    alerts.push({
      id: `alert-o2-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: '⚠️ CRITICAL OXYGEN WARNING: Habitat air reserves are dangerously low (<25%). Recommend switching Oxygen Generation to Boost mode or temporarily diverting power from the Science Lab!',
      type: 'urgent',
      timestamp: timeStr
    });
  } else if (resources.oxygen.current < 45 && resources.oxygen.ratePerHour < 0) {
    alerts.push({
      id: `advice-o2-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: 'Notice: Oxygen levels are steadily declining. Check ECLSS scrubbers and ensure greenhouse hydroponics have at least 50% power to assist carbon dioxide absorption.',
      type: 'advice',
      timestamp: timeStr
    });
  }

  if (resources.energy.current < 25) {
    alerts.push({
      id: `alert-pwr-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: '⚡ POWER GRID STRAIN: Battery reserves under 25%! If energy hits zero, oxygen generators and temperature regulation will shut down. Switch non-essential systems like the Science Lab to idle.',
      type: 'urgent',
      timestamp: timeStr
    });
  }

  if (resources.water.current < 30) {
    alerts.push({
      id: `alert-h2o-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: '💧 WATER ALERT: Outpost water loop is running tight. Ensure the Water Recycler is set to High Recovery mode to recycle 98% of crew graywater.',
      type: 'advice',
      timestamp: timeStr
    });
  }

  if (resources.radiationShielding.current < 35) {
    alerts.push({
      id: `alert-rad-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: '🛡️ RADIATION DEFENSE NOTICE: Outpost magnetic shielding is low. If a NASA DONKI solar event triggers now, crew will receive elevated radiation dosage. Ensure shield capacitors have power.',
      type: 'urgent',
      timestamp: timeStr
    });
  }

  // Energy distribution trade-off checks
  const totalPowerAllocated =
    subsystems.lifeSupportPower +
    subsystems.scienceLabPower +
    subsystems.radiationShieldPower +
    subsystems.greenhousePower +
    subsystems.commsArrayPower;

  if (totalPowerAllocated > 100) {
    alerts.push({
      id: `pwr-overload-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: `⚠️ GRID OVERDRAW: Total subsystem allocation is ${totalPowerAllocated}%. The outpost batteries are draining faster than solar generation can recharge. Please balance your power grid!`,
      type: 'urgent',
      timestamp: timeStr
    });
  } else if (subsystems.scienceLabPower > 30 && resources.energy.current < 40) {
    alerts.push({
      id: `pwr-tradeoff-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: 'Engineering Trade-off: You are allocating 30%+ power to the Science Lab while batteries are below 40%. This maximizes scientific research points, but leaves little buffer if an unexpected dust storm hits.',
      type: 'science',
      timestamp: timeStr
    });
  }

  // Default encouraging advice if all is well
  if (alerts.length === 0) {
    alerts.push({
      id: `nominal-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: 'Outpost telemetry is nominal. Solar arrays, life support loops, and crew health parameters are within green thresholds. Keep monitoring NASA DONKI for space weather updates.',
      type: 'info',
      timestamp: timeStr
    });
  }

  return alerts;
}

export function evaluateMissionPerformance(
  passed: boolean,
  failureReason: string | undefined,
  resources: OutpostResources,
  sciencePoints: number,
  targetScience: number,
  decisionLog: DecisionLogEntry[],
  averageCrewHealth: number
): MissionEvaluation {
  let score = 0;
  const highlights: string[] = [];
  const improvements: string[] = [];
  const spaceEngineeringLessons: string[] = [];

  if (passed) {
    score += 50;
    highlights.push('Completed mission duration without catastrophic outpost failure!');
  } else {
    improvements.push(`Mission ended prematurely: ${failureReason || 'Critical outpost systems depleted.'}`);
  }

  // Resource conservation score
  const avgResourceLevel =
    (resources.oxygen.current +
      resources.energy.current +
      resources.food.current +
      resources.water.current +
      resources.radiationShielding.current) / 5;

  const resourceScore = Math.min(25, Math.round((avgResourceLevel / 100) * 25));
  score += resourceScore;

  if (avgResourceLevel > 60) {
    highlights.push(`Superb resource conservation: Maintained an average ${Math.round(avgResourceLevel)}% across all five core consumables.`);
  } else if (avgResourceLevel < 35) {
    improvements.push('Resource reserves were depleted to razor-thin margins. Work on conserving power during non-emergency sols.');
  }

  // Science score
  const scienceScore = Math.min(25, Math.round((sciencePoints / targetScience) * 25));
  score += scienceScore;

  if (sciencePoints >= targetScience) {
    highlights.push(`Exceeded scientific discovery target (${sciencePoints} / ${targetScience} points achieved)!`);
  } else {
    improvements.push(`Fell short of scientific objective (${sciencePoints} / ${targetScience} points). Allocate more power to the research lab during stable periods.`);
  }

  // Crew health impact
  if (averageCrewHealth >= 90) {
    highlights.push(`Flawless crew care! Average astronaut health was kept at ${Math.round(averageCrewHealth)}%.`);
  } else if (averageCrewHealth < 70) {
    improvements.push('Astronauts suffered health and radiation strain. Ensure radiation shelters and fresh water rations are prioritized.');
  }

  // Engineering lessons derived from decisions
  decisionLog.forEach((d) => {
    if (d.nasaConceptLearned && !spaceEngineeringLessons.includes(d.nasaConceptLearned)) {
      spaceEngineeringLessons.push(d.nasaConceptLearned);
    }
  });

  if (spaceEngineeringLessons.length === 0) {
    spaceEngineeringLessons.push(
      'Every space engineering decision involves a trade-off: shielding takes power, food requires water, and scientific discovery demands energy buffer.',
      'Lunar dust is an abrasive, electrostatic hazard that degrades exterior solar panels.',
      'Hydrogen-rich materials like water and polyethylene offer superior protection against high-energy solar energetic particles.'
    );
  }

  // Calculate grade and rank
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let rankTitle = 'Cadet Trainee';

  if (!passed) {
    grade = 'F';
    rankTitle = 'Mission Aborted - Re-simulate';
  } else if (score >= 90) {
    grade = 'A+';
    rankTitle = 'Master Artemis Commander (Gold Wings 🌟)';
  } else if (score >= 80) {
    grade = 'A';
    rankTitle = 'Senior Mission Flight Director (Silver Wings ⭐)';
  } else if (score >= 70) {
    grade = 'B';
    rankTitle = 'Flight Engineer Specialist';
  } else if (score >= 55) {
    grade = 'C';
    rankTitle = 'Junior Outpost Operator';
  } else {
    grade = 'D';
    rankTitle = 'Astronaut Candidate (Needs Practice)';
  }

  return {
    grade,
    rankTitle,
    passed,
    score,
    crewSurvivalRate: Math.round(averageCrewHealth),
    resourcesConservedScore: resourceScore,
    scienceCompletedScore: scienceScore,
    highlights,
    improvements,
    spaceEngineeringLessons
  };
}

