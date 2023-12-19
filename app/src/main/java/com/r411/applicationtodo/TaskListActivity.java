package com.r411.applicationtodo;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class TaskListActivity extends AppCompatActivity {
    public SharedPreferences sharedPreferences;
    public SharedPreferences.Editor editor;
    public LinearLayout tasksContainer;
    public LayoutInflater inflater;
    public TextView itemUpdated;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_list);

        this.sharedPreferences = getApplicationContext().getSharedPreferences("Tasks", 0);
        this.editor = sharedPreferences.edit();
        this.tasksContainer = findViewById(R.id.tasks_container);
        this.inflater = LayoutInflater.from(this);

        fillTaskList();
    }

    public void sendTaskActivity(View view) {
        Intent intent = new Intent(TaskListActivity.this, TaskCreateActivity.class);
        startActivityForResult(intent, 1);
    }

    public void fillTaskList() {
        Map<String, ?> tasks = sharedPreferences.getAll();

        TextView placeholder = findViewById(R.id.txtStatus);
        if (tasks.size() > 0) {
            placeholder.setVisibility(View.GONE);
        } else {
            placeholder.setVisibility(View.VISIBLE);
        }

        for (Map.Entry<String, ?> task : tasks.entrySet()) {
            this.addTaskToContainer(task.getKey(), (String) task.getValue());
        }
    }

    private void addTaskToContainer(String taskId, String task) {
        try {
            JSONObject taskJson = new JSONObject(task);
            Task taskObj = Task.fromJSON(taskJson);

            TextView placeholder = findViewById(R.id.txtStatus);
            if (this.sharedPreferences.getAll().size() > 0) {
                placeholder.setVisibility(View.GONE);
            } else {
                placeholder.setVisibility(View.VISIBLE);
            }

            View taskItemView = this.inflater.inflate(R.layout.task_item, this.tasksContainer, false);
            TextView taskNameTextView = taskItemView.findViewById(R.id.task_name);
            Button taskButton = taskItemView.findViewById(R.id.complete_button);

            taskNameTextView.setText(taskObj.getTitle());

            taskItemView.setOnClickListener(v -> {
                this.itemUpdated = taskNameTextView;
                Intent intent = new Intent(TaskListActivity.this, TaskDescActivity.class);
                intent.putExtra("taskIdFromList", taskId);
                intent.putExtra("taskContentFromList", task);
                startActivityForResult(intent, 2);
            });

            taskButton.setOnClickListener(v -> {
                this.editor.remove(taskId);
                this.editor.commit();
                this.tasksContainer.removeView(taskItemView);

                if (this.sharedPreferences.getAll().size() > 0) {
                    placeholder.setVisibility(View.GONE);
                } else {
                    placeholder.setVisibility(View.VISIBLE);
                }
            });

            this.tasksContainer.addView(taskItemView);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            int childCount = this.tasksContainer.getChildCount();
            for (int i = childCount - 1; i >= 0; i--) {
                View childView = this.tasksContainer.getChildAt(i);
                if (childView.getId() != R.id.txtStatus) {
                    this.tasksContainer.removeViewAt(i);
                }
            }
            fillTaskList();
        }
    }
}