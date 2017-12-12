class TodosCollection {

    constructor(tag, projects) {


        // Configuration
        this.localStorage_key = 'todo';

        this.fetch(projects);

        this.selectedProject = "";

        this.selectedUuid = "";

        this.id = "";

        if (tag) {
            this.riotjs_tag = tag;
        }


    }

    get(id) {
        return this.collection.find(function (el) {
            return el.client_id == id;
        })

    }


    all(selectedpro) {
        if (selectedpro) {
            return this.collection.filter(function (todo) {
                return todo.project_client_id === selectedpro;
            })
        } else {
            //    console.log("returning this collection in all ", this.collection);
            return this.collection;
        }
    }

    // Saving collection to localStorage
    save() {
        localStorage.setItem(this.localStorage_key, JSON.stringify(this.collection));
        this.riotjs_tag.update();
    }

    // Adds a model to the collection and persists it
    add(model) {
        var that = this;
        model.client_id = this.client_id();
        console.log(model.client_id);

        this.collection.push(model);
        var date = new Date(model.due_date);
        var object = {
            "done": model.done,
            "client_id": model.client_id,
            "title": model.title,
            "project_id": model.project_id,
            "project_client_id": model.project_client_id,
            "priority": model.priority,
            "due_date": date.toISOString()
        };

        var url = "http://zhaw-issue-tracker-api.herokuapp.com/api/projects/" + model.project_id + "/issues";
        console.log(url);

        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(object),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                this.collection.filter(actProject =>
                    actProject.client_id === response.client_id)[0].id = response.id;
                console.log(model.id);

                that.save();
            }
        });

        this.save();
    }

    // Delete selected todo
    delete(model) {
        var that = this;
        //debugger;

        var object = {
            "id": model.id,
            "project_id": model.project_id,
        };

        var url = "http://zhaw-issue-tracker-api.herokuapp.com/api/projects/" + model.project_id + "/issues/" + model.id;
        console.log(url);

        $.ajax({
            method: "DELETE",
            url: url,
            data: JSON.stringify(object),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                // this.collection.filter(actProject =>
                //       actProject.id === response.id)[0].project_id = response.project_id;

            }
        });
        this.collection.find(function (el, index) {
            if (typeof el !== "undefined" && el.client_id == model.client_id) {
                console.log(model)
                that.collection.splice(index, 1, );
                that.save();
                that.riotjs_tag.update();
            }
        })
    }



    // Fetch models from localStorage into collection
    fetch(projects) {

        this.collection = [];
        var that = this;
        for (var i = 0; i < projects.length; i++) {
            var url = "http://zhaw-issue-tracker-api.herokuapp.com/api/projects/" + projects[i].id + "/issues";

            function aaa(i) {
                $.ajax({
                    method: "GET",
                    url: url,
                    contentType: "application/json",
                    dataType: "json",
                    success: (response) => {
                        //   console.log("ssss", projects[i]);
                        for (var j = 0; j < response.length; j++) {
                            var dat = response[j];
                            dat.created_at = new Date(dat.created_at);
                            dat.updated_at = new Date(dat.updated_at);
                            dat.priority = dat.priority;
                            dat.project = projects[i].title;
                            that.collection.push(response[j]);
                        }
                        that.save();

                    }
                });
            };
            aaa(i);
        }
        //this.save();
    }


    done(model) {
        var that = this;
        var date = new Date(model.due_date);

        model.done = !model.done;

        var object = {
            "done": model.done,
            "client_id": model.client_id,
            "title": model.title,
            "project_client_id": model.project_client_id,
            "priority": model.priority,
            "due_date": date.toISOString()
        };

        var url = "http://zhaw-issue-tracker-api.herokuapp.com/api/projects/" + model.project_id + "/issues/" + model.id;
        console.log(url);

        $.ajax({
            method: "PUT",
            url: url,
            data: JSON.stringify(object),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                that.save();
                that.riotjs_tag.update();
            }
        });

    }



    client_id() {
        var client_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        console.log(client_id);
        return client_id;
    }


}
