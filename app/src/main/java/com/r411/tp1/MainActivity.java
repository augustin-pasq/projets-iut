package com.r411.tp1;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        RadioButton fahrenheitButton = (RadioButton) findViewById(R.id.fahrenheit_button);
        fahrenheitButton.setChecked(true);
    }

    @SuppressLint("SetTextI18n")
    public void convert(View view) {
        EditText value = findViewById(R.id.input_field);
        RadioGroup buttonGroup = findViewById(R.id.button_group);
        TextView result = findViewById(R.id.result);

        if(value.getText().toString().isEmpty()) {
            runOnUiThread(() -> Toast.makeText(MainActivity.this, "Veuillez entrer une valeur à convertir.", Toast.LENGTH_LONG).show());
        } else {
                int valueToConvert = Integer.parseInt(value.getText().toString());

            if (buttonGroup.getCheckedRadioButtonId() == findViewById(R.id.celsius_button).getId()) {
                result.setText(((valueToConvert - 32) * 5) / 9 + " °C");
            } else if (buttonGroup.getCheckedRadioButtonId() == findViewById(R.id.fahrenheit_button).getId()) {
                result.setText(((valueToConvert * 9) / 5) + 32 + " °F");
            }
        }

    }
}