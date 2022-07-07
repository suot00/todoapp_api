// var todoApi="https://mocki.io/v1/98b7c261-0478-4999-aa91-336392d56fcb/todos";
var todoApi="https://jsonplaceholder.typicode.com/todos";
const todo_input = document.getElementsByClassName("todo-input")[0];
const btn_add = document.getElementsByClassName("btn-add")[0];

let isUpdate = false;
let idUpdate = null; 


function getTodosAPI(status) {
  switch (status) {
      case "all": {
           return axios.get(todoApi);
      }
      case "active": {
           return axios.get(todoApi+"?status=true");     
      }
      case "unactive": {
           return axios.get(todoApi+"?status=false");
      }
      default: {
          return axios.get(todoApi);
      }
  }
 
}

let todos = [];

async function getTodos() {
    try {
        const res = await getTodosAPI();
        todos = res.data;

        renderUI(todos);
    } catch (error) {
        console.log(error);
    }
}

const todo_list = document.querySelector(".todo-list");

function renderUI(arr) {
  todo_list.innerHTML = "";

  if (arr.length == 0) {
      todo_list.innerHTML = "Không có công việc nào trong danh sách";
      return;
  }

  // Trường hợp có công việc
  for (let i= 0 ; i < arr.length; i++) {
      const t = arr[i];
      
      todo_list.innerHTML += `
          <div class="todo-item ">
          <ul class="taskItem">
          <li class="task">
              <label for="${t.id}" class="taskLabel">
                  <input type="checkbox" class="taskIp" id="${t.id}" ${t.status ? "checked" : ""} 
                  onclick="toggleStatus(${t.id})">
                  <p class="nameTask ${t.status ? "active-todo" : ""}">${t.title}</p>
             </label>       
          <div class="menu-task">
          <button class="edit-task" onclick="updateTitle(${t.id})">Edit
          </button>
              <button class="delete-task" onClick="deleteTodo(${t.id})">Delete</button>
             
          </div>
          </li>
      </ul>
          </div>
        
      `;
  }
}

function createId() {
  return Math.floor(Math.random() * 100000);
}

function createTodoAPI(title) {
  return axios.post(todoApi, {
      id: createId(),
      title: title,
      status: false,
  });
}

async function createTodo(title) {
  try {
      const res = await createTodoAPI(title);
      todos.push(res.data)

      renderUI(todos);
  } catch (error) {
      console.log(error);
  }
}

// Delete
function deleteTodoAPI(id) {
  return axios({
      method : "delete",
      url :  todoApi+'/'+`${id}`
  })
}

async function deleteTodo(id) {
  try {
      await deleteTodoAPI(id) 

      todos.forEach((todo, index) => {
          if(todo.id == id) {
              todos.splice(index, 1)
          }
      })

      renderUI(todos)

  } catch (error) {
      console.log(error);
  }
}
//
function updateTodoAPI(todo) {
  return axios({
      method: "put",
      url: `http://localhost:3000/todos/${todo.id}`,
      data: todo,
  });
}

async function toggleStatus(id) {
  try {
      let todo = todos.find((todo) => todo.id == id);
      todo.status = !todo.status;

      let res = await updateTodoAPI(todo);

      todos.forEach((todo, index) => {
          if (todo.id == id) {
              todos[index] = res.data;
          }
      });
      renderUI(todos);
  } catch (error) {
      console.log(error);
  }
}

const todo_option_item = document.querySelectorAll(".todo-option-item input");

function getOptionSelected() {
    for (let i = 0; i < todo_option_item.length; i++) {
        if (todo_option_item[i].checked) {
            return todo_option_item[i].value;
        }
    }
}

todo_option_item.forEach((btn) => {
    btn.addEventListener("change", function () {
        let optionSelected = getOptionSelected();
        getTodosAPI(optionSelected);
    });
});


function updateTitle(id) {
  let title;
  todos.forEach((todo) => {
      if (todo.id == id) {
          title = todo.title;
      }
  });

  btn_add.innerText = "Update";

  todo_input.value = title;
  todo_input.focus();

  idUpdate = id;
  isUpdate = true;
}

btn_add.addEventListener("click", function () {
  let todoTitle = todo_input.value;
  if (isUpdate) {
      let todo = todos.find((todo) => todo.id == idUpdate);
      todo.title = todoTitle;

      updateTodo(todo);
  } else {
      createTodo(todoTitle);
  }

  todo_input.value = "";
});
async function updateTodo(todoUpdate) {
  try {
      let res = await updateTodoAPI(todoUpdate);

      todos.forEach((todo, index) => {
          if (todo.id == todoUpdate.id) {
              todos[index] = res.data;
          }
      });

      btn_add.innerText = "Add";
      isUpdate = false;
      idUpdate = null;

      renderUI(todos);
  } catch (error) {
      console.log(error);
  }
}

  getTodos();
