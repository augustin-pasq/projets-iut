package com.r411.applicationtodo;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.material.chip.Chip;

import org.json.JSONException;
import org.json.JSONObject;

public class TaskDescActivity extends AppCompatActivity {
    public Task taskObj;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_desc);

        try {
            Intent intentFromList = getIntent();
            JSONObject taskJson = new JSONObject(intentFromList.getStringExtra("taskContentFromList"));
            this.taskObj = Task.fromJSON(taskJson);

            Button editButton = findViewById(R.id.edit_button);
            editButton.setOnClickListener(v -> {
                try {
                    Intent intentEditButton = new Intent(TaskDescActivity.this, TaskEditActivity.class);
                    intentEditButton.putExtra("taskId", intentFromList.getStringExtra("taskIdFromList"));
                    intentEditButton.putExtra("taskContent", this.taskObj.toJSON().toString());
                    startActivityForResult(intentEditButton, 1);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            });
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        getTask();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            try {
                JSONObject taskJson = new JSONObject(data.getStringExtra("taskContent"));
                this.taskObj = Task.fromJSON(taskJson);

                getTask();
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void getTask() {
        TextView title = findViewById(R.id.task_title);
        TextView description = findViewById(R.id.task_description);
        TextView link = findViewById(R.id.task_link);
        Chip date = findViewById(R.id.task_date);
        Chip context = findViewById(R.id.task_context);

        title.setText(this.taskObj.getTitle());
        description.setText(this.taskObj.getDescription());
        date.setText(this.taskObj.getDate());
        context.setText(this.taskObj.getContext());
        link.setText(this.taskObj.getLink());

        link.setOnClickListener(v -> {
            Intent intentWebView = new Intent(TaskDescActivity.this, WebViewActivity.class);
            intentWebView.putExtra("link", this.taskObj.getLink());
            startActivity(intentWebView);
        });
    }

    public void closeActivity(View view) throws JSONException {
        Intent resultIntent = new Intent();
        resultIntent.putExtra("taskUpdated", this.taskObj.toJSON().toString());
        setResult(RESULT_OK, resultIntent);
        finish();
    }
}