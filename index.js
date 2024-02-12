const prompts = require("./prompts")

const getJsonObjectFromString = (str) => {
  const jsonStart = str.indexOf('{');
  const jsonEnd = str.lastIndexOf('}') + 1;
  const jsonString = str.slice(jsonStart, jsonEnd);

  try {
    const jsonObj = JSON.parse(jsonString);
    return jsonObj;
  } catch (error) {
    throw new Error('Invalid JSON string:', error);
  }
}

const agent = () => {
  /**
    Sample JSON Request Body:
    {
      "model": "gpt-4.0-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "Who won the world series in 2020?"
        }
      ]
    }

    Sample JSON Response Body:
    {
      "id": "chatcmpl-3Km9XYPYSTTRi0xEviKjjilqr2U2e",
      "object": "chat.completion",
      "created": 1654789230,
      "model": "gpt-4.0-turbo",
      "usage": {
        "prompt_tokens": 56,
        "completion_tokens": 31,
        "total_tokens": 87
      },
      "choices": [
        {
          "message": {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          "finish_reason": "stop",
          "index": 0
        },
        {
          "message": {
            "role": "user",
            "content": "Who won the world series in 2020?"
          },
          "finish_reason": "stop",
          "index": 1
        },
        {
          "message": {
            "role": "assistant",
            "content": "The Los Angeles Dodgers won the World Series in 2020."
          },
          "finish_reason": "stop",
          "index": 2
        }
      ]
    }

   */
  return {
    prompt: async (message) => {
      const targetEndpoint = "";
      const result = await fetch("http://localhost:3000/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body)
      });
      return await result.json();
    }
  }
}

const embedding_function = (value) => {
  return;
}

const goal_achieved = async (agentInstance, result, goal) => {
  await agentInstance.prompt(prompts.assessAchieved())
}

const sub_tasks_empty = () => {
  return sub_tasks.length === 0;
}

const generate_sub_tasks = () => {

}

const sub_task_requires_memory = () => {
  return false;
}

const use_similar_items = () => {

}

const sub_task_requires_tool = () => {

}

const find_tool = () => {
  
}

const VectorDatabase = () => {
  return {
    knn_search: () => {
      return;
    },
    store: () => {
      return;
    }
  }
}

const main = () => {
    // Define the goal in natural language
    let goal = "Create a website about cats";
    
    // Initialize an empty array of sub-tasks
    let sub_tasks = [];
    
    // Initialize an empty array of completed tasks
    let completed_tasks = [];
    
    // Initialize an empty array of tools
    let tools = [];
    
    // Initialize a vector database object
    let vector_db = new VectorDatabase();
    
    // Define the similarity function as a function that takes a query embedding and returns the top-K most similar items from the vector database
    function similarity_function(query_embedding) {
      // Use the vector database to perform a KNN or approximate-KNN search based on the query embedding
      let similar_items = vector_db.knn_search(query_embedding, K);
      return similar_items;
    }
    
    // Repeat until the goal is achieved or no more sub-tasks can be generated
    while (!goal_achieved(goal) && !sub_tasks_empty(sub_tasks)) {
    
      // If there are no sub-tasks, generate some using GPT-4
      if (sub_tasks_empty(sub_tasks)) {
        sub_tasks = generate_sub_tasks(goal);
      }
    
      // Pop the first sub-task from the array
      let sub_task = sub_tasks.shift();
    
      // If the sub-task is already completed, skip it
      if (completed_tasks.includes(sub_task)) {
        continue;
      }
    
      // If the sub-task requires a tool, find one using the internet
      if (sub_task_requires_tool(sub_task)) {
        let tool = find_tool(sub_task);
        tools.push(tool);
      }
    
      // Execute the sub-task using GPT-4 and the tool (if any)
      let value = execute_sub_task(sub_task, tool);
    
      // Convert the value into an embedding using the embedding function
      let embedding = embedding_function(value);
    
      // Store the value and the embedding in the vector database
      vector_db.store(value, embedding);
    
      // Add the sub-task to the array of completed tasks
      completed_tasks.push(sub_task);
    
      // If the sub-task requires information from the long-term memory, use the similarity function to find the most similar items based on a query
      if (sub_task_requires_memory(sub_task)) {
        let query = generate_query(sub_task);
        let query_embedding = embedding_function(query);
        let similar_items = similarity_function(query_embedding);
        use_similar_items(similar_items, sub_task);
      }
    }
    
    // If the goal is achieved, display a success message
    if (goal_achieved(goal)) {
      display_message("Goal achieved!");
    }
    
    // If the goal is not achieved, display a failure message
    else {
      display_message("Goal not achieved!");
    }
}
