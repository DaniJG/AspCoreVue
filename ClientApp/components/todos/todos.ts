import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface TodoItem {
    description: string;
    done: boolean;
    id: string;
}

@Component
export default class TodoComponent extends Vue {
    todos: TodoItem[];
    newItemDescription: string;

    data() {
        return {
            todos: [],
            newItemDescription: null
        };
    } 

    mounted() {
        fetch('/api/todo')
            .then(response => response.json() as Promise<TodoItem[]>)
            .then(data => {
                this.todos = data;
            });
    }

    addItem(event){
        if(event) event.preventDefault();
        
        fetch('/api/todo', {
          method: 'post',
          body: JSON.stringify(<TodoItem>{description: this.newItemDescription}),
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        })
        .then(response => response.json() as Promise<TodoItem>)
        .then((newItem) => {
            this.todos.push(newItem);
            this.newItemDescription = null;
        });
    }

    completeItem(item: TodoItem){
        fetch(`/api/todo/${item.id}`, {
          method: 'delete',
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        })
        .then(() => {
            this.todos = this.todos.filter((t) => t.id !== item.id);
        });
    }
}
