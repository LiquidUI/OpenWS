package com.zebra.rfid.demo.sdksample;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.zebra.rfid.api3.ENUM_TAGQUIET_MASK;
import com.zebra.rfid.api3.INVENTORY_STATE;
import com.zebra.rfid.api3.MEMORY_BANK;
import com.zebra.rfid.api3.SESSION;
import com.zebra.rfid.api3.STATE_AWARE_ACTION;
import com.zebra.rfid.api3.TARGET;
import com.zebra.rfid.api3.TagData;
import com.zebra.scannercontrol.SDKHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Sample app to connect to the reader,to do inventory and basic barcode scan
 * We can also set antenna settings and singulation control
 * */

public class MainActivity extends AppCompatActivity implements RFIDHandler.ResponseHandlerInterface {

    public TextView statusTextViewRFID = null;
    public TextView textrfid , scanResult;
    public EditText tagIdEditText, passwordEditText;
    public TARGET target;
    public STATE_AWARE_ACTION stateAwareAction;
    public byte byteval;

    RFIDHandler rfidHandler;
    final static String TAG = "RFID_SAMPLE";
    public static SDKHandler sdkHandler;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE = 100;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // RFID Handler
        statusTextViewRFID = (TextView) findViewById(R.id.textViewStatusrfid);
        textrfid = (TextView) findViewById(R.id.edittextrfid);
        scanResult = (TextView) findViewById(R.id.scanResult);
        tagIdEditText= findViewById(R.id.tagId);
        passwordEditText  = findViewById(R.id.password);

        rfidHandler = new RFIDHandler();
        //rfidHandler.onCreate(this);
        rfidHandler.impinjTag = tagIdEditText.getText().toString();
        rfidHandler.password = passwordEditText.getText().toString();
        tagIdEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                rfidHandler.impinjTag = s.toString();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        passwordEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                rfidHandler.password = s.toString();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
        //Scanner Initializations
        //Handling Runtime BT permissions for Android 12 and higher
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.S){
            if (ContextCompat.checkSelfPermission(this,
                    Manifest.permission.BLUETOOTH_CONNECT)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT}, BLUETOOTH_PERMISSION_REQUEST_CODE);
            }else{
                rfidHandler.onCreate(this);
            }

        }else{
            rfidHandler.onCreate(this);
        }

    }

    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {

        if(requestCode == BLUETOOTH_PERMISSION_REQUEST_CODE){
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                rfidHandler.onCreate(this);
            }
            else {
                Toast.makeText(this, "Bluetooth Permissions not granted", Toast.LENGTH_SHORT).show();
            }
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
//        if (id == R.id.antenna_settings) {
//            String result = rfidHandler.Test1();
//            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
//            return true;
//        }
//
//        if (id == R.id.Singulation_control) {
//            String result = rfidHandler.Test2();
//            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
//            return true;
//        }
//        if (id == R.id.Default) {
//            String result = rfidHandler.Defaults();
//            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
//            return true;
//        }
        if (id == R.id.enableImpinjVisiblity){
            String result = rfidHandler.enableImpinjVisibility();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }

        if (id  == R.id.enableImpinjProtect){
            String result = rfidHandler.enableImpinjProtection();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }

        if (id  == R.id.disableImpinjVisiblity){
            String result = rfidHandler.disableImpinjVisibilty();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }

        if (id == R.id.disableImpinjProtect){
            String result = rfidHandler.disableImpinjProtection();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }

        if(id == R.id.tagFocus){
            showTagFocusDialog();
            return true;
        }
        if(id == R.id.tagQuiet){
            String result = showCustomTagQuietDialog();

            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }

//        if (id == R.id.removetagQuiet){
//            String result = rfidHandler.removeTagQuiet();
//            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
//            return true;
//        }

        if(id == R.id.singulation){
            String result = showCustomSingulation();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }
        if(id == R.id.prefilter){
            showPrefilterDialog();
            return  true;
        }


        return super.onOptionsItemSelected(item);
    }


    @Override
    protected void onPause() {
        super.onPause();
        //rfidHandler.onPause();
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
        String result = rfidHandler.onResume();
        statusTextViewRFID.setText(result);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        rfidHandler.onDestroy();
    }

    public void StartInventory(View view)
    {
        textrfid.setText("");
        rfidHandler.performInventory();
        //   rfidHandler.MultiTag();
    }
    public void scanCode(View view){
        rfidHandler.scanCode();

    }



    public void testFunction(View view){
        rfidHandler.testFunction();
    }

    public void StopInventory(View view){
        rfidHandler.stopInventory();
    }

    @Override
    public void handleTagdata(TagData[] tagData) {
        final StringBuilder sb = new StringBuilder();
        for (int index = 0; index < tagData.length; index++) {
            sb.append(tagData[index].getTagID() + " ,   "+tagData[index].getPeakRSSI()+ "\n");
        }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                textrfid.append(sb.toString());
            }
        });
    }

    @Override
    public void handleTriggerPress(boolean pressed) {
        if (pressed) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    textrfid.setText("");
                }
            });
            rfidHandler.performInventory();
        } else
            rfidHandler.stopInventory();
    }

    @Override
    public void barcodeData(String val) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                scanResult.setText("Scan Result : "+val);
            }
        });

    }

    @Override
    public void sendToast(String val) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this,val,Toast.LENGTH_SHORT).show();
            }
        });

    }


    private String showCustomTagQuietDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_tag_quiet, null);

        Spinner spinner1 = dialogView.findViewById(R.id.Target);
        Spinner spinner2 = dialogView.findViewById(R.id.State);

        Spinner mask1 = dialogView.findViewById(R.id.mask1);
        Spinner mask2 = dialogView.findViewById(R.id.mask2);
        Spinner mask3 = dialogView.findViewById(R.id.mask3);

        ArrayAdapter<String> maskAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.tagmask_enum));
        mask1.setAdapter(maskAdapter);
        mask2.setAdapter(maskAdapter);
        mask3.setAdapter(maskAdapter);

        ArrayAdapter<String> targetAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.pre_filter_target_options)
        );

        spinner1.setAdapter(targetAdapter);

        ArrayAdapter<String> state_aware_action_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.pre_filter_action_array)
        );
        spinner2.setAdapter(state_aware_action_adapter);

        new AlertDialog.Builder(this)
                .setTitle("Input Values")
                .setView(dialogView)
                .setPositiveButton("OK", (dialog, which) -> {


                    String spinner1Value = spinner1.getSelectedItem().toString();
                    String spinner2Value = spinner2.getSelectedItem().toString();

                    target = TARGET.getTarget(spinner1.getSelectedItemPosition());
                    stateAwareAction = getStateAwareActionFromString(spinner2Value);

                    List<ENUM_TAGQUIET_MASK> maskList = new ArrayList<>();
                    try {
                        ENUM_TAGQUIET_MASK m1 = ENUM_TAGQUIET_MASK.fromString(mask1.getSelectedItem().toString());
                        if (m1 != null) maskList.add(m1);
                    } catch (IllegalArgumentException ignored) {}

                    try {
                        ENUM_TAGQUIET_MASK m2 = ENUM_TAGQUIET_MASK.fromString(mask2.getSelectedItem().toString());
                        if (m2 != null) maskList.add(m2);
                    } catch (IllegalArgumentException ignored) {}

                    try {
                        ENUM_TAGQUIET_MASK m3 = ENUM_TAGQUIET_MASK.fromString(mask3.getSelectedItem().toString());
                        if (m3 != null) maskList.add(m3);
                    } catch (IllegalArgumentException ignored) {}

                    ENUM_TAGQUIET_MASK[] masks = maskList.toArray(new ENUM_TAGQUIET_MASK[0]);
                    String result = rfidHandler.tagQuiet(masks, target, stateAwareAction);
                    Toast.makeText(MainActivity.this, result, Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
        return "";
    }

    private STATE_AWARE_ACTION getStateAwareActionFromString(String strAction) {
        STATE_AWARE_ACTION action = null;
        if (strAction.equalsIgnoreCase("INV A NOT INV B OR ASRT SL NOT DSRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_INV_A_NOT_INV_B;
        if (strAction.equalsIgnoreCase("INV A OR ASRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_INV_A;
        if (strAction.equalsIgnoreCase("NOT INV B OR NOT DSRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_NOT_INV_B;
        if (strAction.equalsIgnoreCase("INV A2BB2A NOT INV A OR NEG SL NOT ASRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_INV_A2BB2A_NOT_INV_A;
        if (strAction.equalsIgnoreCase("INV B NOT INV A OR DSRT SL NOT ASRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_INV_B_NOT_INV_A;
        if (strAction.equalsIgnoreCase("INV B OR DSRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_INV_B;
        if (strAction.equalsIgnoreCase("NOT INV A OR NOT ASRT SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_NOT_INV_A;
        if (strAction.equalsIgnoreCase("NOT INV A2BB2A OR NOT NEG SL"))
            action = STATE_AWARE_ACTION.STATE_AWARE_ACTION_NOT_INV_A2BB2A;
        return action;
    }

    private String showCustomSingulation(){
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_set_session, null);
        Spinner inv_state_spinner = dialogView.findViewById(R.id.InventoryState);
        Spinner sessionSpinner = dialogView.findViewById(R.id.session);

        ArrayAdapter<String> inventoryStateAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.inventory_state_array)
        );

        inv_state_spinner.setAdapter(inventoryStateAdapter);

        ArrayAdapter<String> state_aware_action_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.session_array)
        );
        sessionSpinner.setAdapter(state_aware_action_adapter);

        new AlertDialog.Builder(this)
                .setTitle("Input Values")
                .setView(dialogView)
                .setPositiveButton("OK", (dialog, which) -> {


                    String spinner1Value = inv_state_spinner.getSelectedItem().toString();
                    String spinner2Value = sessionSpinner.getSelectedItem().toString();

                    SESSION session = SESSION.GetSession(sessionSpinner.getSelectedItemPosition());
                    INVENTORY_STATE inventoryState = INVENTORY_STATE.GetInventoryState(inv_state_spinner.getSelectedItemPosition());

                    String result = rfidHandler.singulation(session, inventoryState);
                    Toast.makeText(MainActivity.this, result, Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
        return "";
    }

    private void showPrefilterDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_prefilter, null);
        Spinner targetSpinner = dialogView.findViewById(R.id.prefilter_target_spinner);
        Spinner actionSpinner = dialogView.findViewById(R.id.prefilter_action_spinner);
        Spinner membankSpinner = dialogView.findViewById(R.id.prefilter_membank_spinner);
        EditText pointerEditText = dialogView.findViewById(R.id.pointer_edittext);
        EditText maskEditText = dialogView.findViewById(R.id.mask_edittext);
        EditText lengthEditText = dialogView.findViewById(R.id.length_edittext);
        Button saveButton = dialogView.findViewById(R.id.save_button);

        // Set up adapters for the spinners
        ArrayAdapter<String> targetAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.pre_filter_target_options));
        targetAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        targetSpinner.setAdapter(targetAdapter);

        ArrayAdapter<String> actionAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.pre_filter_action_array));
        actionAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        actionSpinner.setAdapter(actionAdapter);

        ArrayAdapter<String> membankAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                getResources().getStringArray(R.array.memory_bank_array));
        membankAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        membankSpinner.setAdapter(membankAdapter);

        // Build the dialog
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setView(dialogView);
        builder.setTitle("Configure Settings");
        final AlertDialog dialog = builder.create();

        saveButton.setOnClickListener(v -> {
            // Handle save button click
            String pointerValue = pointerEditText.getText().toString();

            MEMORY_BANK mb = MEMORY_BANK.GetMemoryBankValue(membankSpinner.getSelectedItem().toString());
            TARGET target1 = TARGET.getTarget(targetSpinner.getSelectedItemPosition());
            STATE_AWARE_ACTION stateAwareAction1 = getStateAwareActionFromString(actionSpinner.getSelectedItem().toString());

            String mask = maskEditText.getText().toString();
            int pointer = pointerValue.isEmpty() ? 0 : Integer.parseInt(pointerValue);
            String lengthStr = lengthEditText.getText().toString();
            int length = lengthStr.isEmpty() ? 0 : Integer.parseInt(lengthStr);

            rfidHandler.setPrefilter(mb, stateAwareAction1, target1, mask, pointer, length);
            dialog.dismiss();
        });

        // Display the dialog
        dialog.show();
    }

    private void showTagFocusDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_tagfocus, null);
        RadioGroup radioGroup = dialogView.findViewById(R.id.radioGroup_tagfocus);
        RadioButton radioYes = dialogView.findViewById(R.id.radio_tagfocus_yes);
        RadioButton radioNo = dialogView.findViewById(R.id.radio_tagfocus_no);

        // Optionally, set default selection (e.g., Yes)
        radioYes.setChecked(true);

        new AlertDialog.Builder(this)
            .setTitle("Set TagFocus")
            .setView(dialogView)
            .setPositiveButton("OK", (dialog, which) -> {
                boolean isTagFocus = radioGroup.getCheckedRadioButtonId() == R.id.radio_tagfocus_yes;
                String result = rfidHandler.tagFocus(isTagFocus);
                Toast.makeText(MainActivity.this, result, Toast.LENGTH_SHORT).show();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
}
