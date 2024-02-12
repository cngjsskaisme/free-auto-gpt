const settings = require("./settings")

const prompts = {
  createRole: (goal) => `
  Describe what type of role would be fit in order to acheive to do following job, which is "${goal}", in following example format.
  
  Example format: Now you are a travelGuideGPT, in order to make a 3-day plan.
  `,
  initQuery: (gptRole, goal) => `
  ${gptRole}
  And after that, in order to achieve a goal "${goal}", please make a list of subtasks with this following conditions.

  - Identify your goal and write it down. Make sure it is specific, measurable, achievable, relevant, and time-bound (SMART).
  - Organize your goal into categories or sub-goals. Break down your goal into smaller and more manageable parts that can help you track your progress and motivate you to keep going.
  - Assess each sub-goal and make a plan. For each sub-goal, identify the actions, resources, and tools you need to complete it. Also, anticipate the potential challenges or obstacles you might face and how you can overcome them.
  - Prioritize your sub-goals and actions. Decide which sub-goals and actions are more important or urgent than others and focus on them first. You can use a matrix or a list to rank them according to your criteria.
  - Turn your sub-goals and actions into smaller steps. For each sub-goal and action, create a series of steps that will guide you from start to finish. Make sure each step is clear, concrete, and achievable.
  - Create a system and follow it. A system is a set of habits, routines, or rules that you follow consistently to achieve your goal. A system can help you stay focused, organized, and disciplined. It can also help you automate some of the steps or actions you need to do regularly.
  - Stop planning and start doing. The most important step to achieving a goal is to take action. No matter how good your plan or system is, it won't work unless you execute it. Start with the easiest or most urgent step and work your way up. Don't let fear, doubt, or procrastination stop you from taking action.

  The format should be a list of arrays in a markup codeblock, which is a format of:
  ["subtask1 with detailed descriptions", "subtask2 with detailed descriptions", ...]
  `,
  evaluate: (result) => `
  Here is a prompt to evaluate the appropriateness of a response from an AI model like GPT-4:

  Let's consider the following result from GPT-4 and discuss whether it is an appropriate response: 
  
  ${result}
  
  Some factors we may want to examine include:
  
  - Relevance: How well does the response answer the question or comment on the prompt? Is it on or off topic?
  
  - Accuracy: Does the response contain factually correct information? Or does it spread misinformation?
  
  - Harmfulness: Could the response cause harm, offense, or negatively impact someone's well-being or rights?
  
  - Bias: Does the response reflect unfair prejudice or favoritism towards certain groups? 
  
  - Sensitivity: Is the tone and language of the response respectful and sensitive to different audiences?
  
  - Usefulness: Beyond being inoffensive, does the response provide useful insights, advice or recommendations if answering a question?
  
  Based on a holistic evaluation of the response against these factors, we could then determine if it is an appropriate or inappropriate result from the AI model in this particular context. 
  
  If the given result from GPT-4 is not enough to make a determination, please request additional context or details from the user to help with the evaluation process. A more complete picture will allow for a more informed analysis.
  `,
  assessUseTool: (availableTools, subtask) => `
  Please tell the following subtask is need to use tool in the following tools list.
  Available Tools with function signature : ${JSON.stringify(availableTools)}
  Subtask : "${subtask}"
  If so, then return the result with the following json format in a codeblock.
  And also, if it is not neccesary, then just make shouldUse: false, and empty code signature.
  { shouldUse: boolean, codeSignature: "It should be string with code signature with following parameters."}
  `,
  assessAchieved: (result, goal) => `
  ${result}
  From the following result, define the goal_achieved function as a function that takes a goal and returns a boolean value.
  Check if the goal is a specific and measurable outcome that can be verified by following criteria:
  ${goal}
  If yes, compare the current state of the program with the desired state of the goal
  If they match, say True
  If they do not match, say False
  `
}

export {
  prompts
}