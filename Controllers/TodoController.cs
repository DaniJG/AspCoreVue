using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ASPCoreVue.Models;

namespace AspCoreVue.Controllers
{
    [Route("api/[controller]")]
    public class TodoController : Controller
    {
        private static ConcurrentBag<Todo> todos = new ConcurrentBag<Todo> {
            new Todo { Id = Guid.NewGuid(), Description = "Learn Vue" }
        };

        [HttpGet()]
        public IEnumerable<Todo> GetTodos()
        {
            return todos.Where(t => !t.Done);
        }

        [HttpPost()]
        public Todo AddTodo([FromBody]Todo todo)
        {
            todo.Id = Guid.NewGuid();
            todo.Done = false;
            todos.Add(todo);
            return todo;
        }

        [HttpDelete("{id}")]
        public ActionResult CompleteTodo(Guid id)
        {
            var todo = todos.SingleOrDefault(t => t.Id == id);
            if (todo == null) return NotFound();

            todo.Done = true;
            return StatusCode(204);
        }
    }
}
