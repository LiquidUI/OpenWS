package com.zebra.rfid.demo.sdksample;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.TextView;

import com.zebra.rfid.api3.Antennas;
import com.zebra.rfid.api3.ENUM_TAGQUIET_MASK;
import com.zebra.rfid.api3.ENUM_TRANSPORT;
import com.zebra.rfid.api3.ENUM_TRIGGER_MODE;
import com.zebra.rfid.api3.FILTER_ACTION;
import com.zebra.rfid.api3.HANDHELD_TRIGGER_EVENT_TYPE;
import com.zebra.rfid.api3.INVENTORY_STATE;
import com.zebra.rfid.api3.IRFIDLogger;
import com.zebra.rfid.api3.ImpinjExtensions;
import com.zebra.rfid.api3.InvalidUsageException;
import com.zebra.rfid.api3.LOCK_DATA_FIELD;
import com.zebra.rfid.api3.LOCK_PRIVILEGE;
import com.zebra.rfid.api3.MEMORY_BANK;
import com.zebra.rfid.api3.OperationFailureException;
import com.zebra.rfid.api3.PreFilters;
import com.zebra.rfid.api3.RFIDReader;
import com.zebra.rfid.api3.ReaderDevice;
import com.zebra.rfid.api3.Readers;
import com.zebra.rfid.api3.RfidEventsListener;
import com.zebra.rfid.api3.RfidReadEvents;
import com.zebra.rfid.api3.RfidStatusEvents;
import com.zebra.rfid.api3.SESSION;
import com.zebra.rfid.api3.SL_FLAG;
import com.zebra.rfid.api3.START_TRIGGER_TYPE;
import com.zebra.rfid.api3.STATE_AWARE_ACTION;
import com.zebra.rfid.api3.STATUS_EVENT_TYPE;
import com.zebra.rfid.api3.STOP_TRIGGER_TYPE;
import com.zebra.rfid.api3.TARGET;
import com.zebra.rfid.api3.TRUNCATE_ACTION;
import com.zebra.rfid.api3.TagAccess;
import com.zebra.rfid.api3.TagData;
import com.zebra.rfid.api3.TriggerInfo;
import com.zebra.scannercontrol.DCSSDKDefs;
import com.zebra.scannercontrol.DCSScannerInfo;
import com.zebra.scannercontrol.FirmwareUpdateEvent;
import com.zebra.scannercontrol.IDcsSdkApiDelegate;
import com.zebra.scannercontrol.SDKHandler;

import java.util.ArrayList;


class RFIDHandler implements IDcsSdkApiDelegate, Readers.RFIDReaderEventHandler {

    final static String TAG = "RFID_SAMPLE";
    private Readers readers;
    private ArrayList<ReaderDevice> availableRFIDReaderList;
    private ReaderDevice readerDevice;
    private RFIDReader reader;
    TextView textView;
    private EventHandler eventHandler;
    private MainActivity context;
    private SDKHandler sdkHandler;
    private ArrayList<DCSScannerInfo> scannerList;
    private ImpinjExtensions impinjExtensions;
    private int scannerID;
    static MyAsyncTask cmdExecTask = null;
    private int MAX_POWER = 270;
    private int DEVICE_STD_MODE = 0;
    private int DEVICE_PREMIUM_PLUS_MODE = 1;

    // In case of RFD8500 change reader name with intended device below from list of paired RFD8500
    // If barcode scan is available in RFD8500, for barcode scanning change mode using mode button on RFD8500 device. By default it is set to RFID mode
    String readerNamebt = "RFD40+_211545201D0011";
    String readerName = "RFD4031-G10B700-US";
    String RFD8500 = "RFD8500161755230D5038";

    void onCreate(MainActivity activity) {
        context = activity;
        textView = activity.statusTextViewRFID;
        scannerList = new ArrayList<>();
        InitSDK();
    }

    @Override
    public void dcssdkEventScannerAppeared(DCSScannerInfo dcsScannerInfo) {

    }

    @Override
    public void dcssdkEventScannerDisappeared(int i) {

    }

    @Override
    public void dcssdkEventCommunicationSessionEstablished(DCSScannerInfo dcsScannerInfo) {

    }

    @Override
    public void dcssdkEventCommunicationSessionTerminated(int i) {

    }

    @Override
    public void dcssdkEventBarcode(byte[] barcodeData, int barcodeType, int fromScannerID) {
        String s = new String(barcodeData);
        context.barcodeData(s);
        Log.d(TAG,"barcaode ="+ s);
    }

    @Override
    public void dcssdkEventImage(byte[] bytes, int i) {

    }

    @Override
    public void dcssdkEventVideo(byte[] bytes, int i) {

    }

    @Override
    public void dcssdkEventBinaryData(byte[] bytes, int i) {

    }

    @Override
    public void dcssdkEventFirmwareUpdate(FirmwareUpdateEvent firmwareUpdateEvent) {

    }

    @Override
    public void dcssdkEventAuxScannerAppeared(DCSScannerInfo dcsScannerInfo, DCSScannerInfo dcsScannerInfo1) {

    }



// TEST BUTTON functionality
    // following two tests are to try out different configurations features

    public String Test1() {
        // check reader connection
        if (!isReaderConnected())
            return "Not connected";
        // set antenna configurations - reducing power to 200
        try {
            Antennas.AntennaRfConfig config = null;
            config = reader.Config.Antennas.getAntennaRfConfig(1);
            config.setTransmitPowerIndex(100);
            config.setrfModeTableIndex(0);
            config.setTari(0);
            reader.Config.Antennas.setAntennaRfConfig(1, config);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Antenna power Set to 220";
    }



    public String Test2() {
        // check reader connection
        if (!isReaderConnected())
            return "Not connected";
        // Set the singulation control to S2 which will read each tag once only
        try {
            Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
            s1_singulationControl.setSession(SESSION.SESSION_S2);
            s1_singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_A);
            s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
            reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Session set to S2";
    }

    public String Defaults() {
        // check reader connection
        if (!isReaderConnected())
            return "Not connected";;
        try {
            // Power to 270
            Antennas.AntennaRfConfig config = null;
            config = reader.Config.Antennas.getAntennaRfConfig(1);
            config.setTransmitPowerIndex(MAX_POWER);
            config.setrfModeTableIndex(0);
            config.setTari(0);
            reader.Config.Antennas.setAntennaRfConfig(1, config);
            // singulation to S0
            Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
            s1_singulationControl.setSession(SESSION.SESSION_S0);
            s1_singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_A);
            s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
            reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Default settings applied";
    }

    private boolean isReaderConnected() {
        if (reader != null && reader.isConnected())
            return true;
        else {
            Log.d(TAG, "reader is not connected");
            return false;
        }
    }

    //
    //  Activity life cycle behavior
    //

    String onResume() {
        return connect();
    }

    void onPause() {
        disconnect();
    }

     void onDestroy() {
        dispose();
    }

    //
    // RFID SDK
    //
    private void InitSDK() {
        Log.d(TAG, "InitSDK");
        if (readers == null) {
            new CreateInstanceTask().execute();
        } else
            connectReader();
    }

    public void testFunction() {
        //setPreFilters();
        //testReadevent();
        try {
            Log.d(TAG, "Delete Prefilter...");
            //singulationControl // mRfidReader.Config.Antennas.getSingulationControl(1);
            reader.Actions.PreFilters.deleteAll();
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        }
    }

    private void testReadevent() {
        TagAccess tagAccess = new TagAccess();
        TagAccess.LockAccessParams lockAccessParams =  tagAccess.new LockAccessParams();
        lockAccessParams.setLockPrivilege(LOCK_DATA_FIELD.LOCK_USER_MEMORY, LOCK_PRIVILEGE.LOCK_PRIVILEGE_READ_WRITE);
        lockAccessParams.setAccessPassword(Long.decode("0X" + "12341234"));
        try {
            reader.Actions.TagAccess.lockEvent(lockAccessParams,null,null);
        } catch (InvalidUsageException e) {
            throw new RuntimeException(e);
        } catch (OperationFailureException e) {
            throw new RuntimeException(e);
        }
    }

    public void setPreFilters() {
        Log.d("setPrefilter", "setPrefilter...");
        PreFilters.PreFilter[] preFilterArray = new PreFilters.PreFilter[8];

        PreFilters filters = new PreFilters();
        PreFilters.PreFilter filter = filters.new PreFilter();
        filter.setAntennaID((short) 1);
        filter.setTagPattern("00000");
        filter.setTagPatternBitCount(4);
        filter.setBitOffset(32);
        filter.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[0] = filter;

        PreFilters filters1 = new PreFilters();
        PreFilters.PreFilter filter1 = filters1.new PreFilter();
        filter1.setAntennaID((short) 1);
        filter1.setTagPattern("111111");
        filter1.setTagPatternBitCount(4);
        filter1.setBitOffset(32);
        filter1.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter1.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter1.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter1.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter1.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[1] = filter1;

        PreFilters filters2 = new PreFilters();
        PreFilters.PreFilter filter2 = filters2.new PreFilter();
        filter2.setAntennaID((short) 1);
        filter2.setTagPattern("22222");
        filter2.setTagPatternBitCount(4);
        filter2.setBitOffset(32);
        filter2.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter2.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter2.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter2.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter2.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[2] = filter2;

        PreFilters filters3 = new PreFilters();
        PreFilters.PreFilter filter3 = filters3.new PreFilter();
        filter3.setAntennaID((short) 1);
        filter3.setTagPattern("33333");
        filter3.setTagPatternBitCount(4);
        filter3.setBitOffset(32);
        filter3.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter3.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter3.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter3.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter3.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[3] = filter3;

        PreFilters filters4 = new PreFilters();
        PreFilters.PreFilter filter4 = filters4.new PreFilter();
        filter4.setAntennaID((short) 1);
        filter4.setTagPattern("44444");
        filter4.setTagPatternBitCount(4);
        filter4.setBitOffset(32);
        filter4.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter4.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter4.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter4.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter4.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[4] = filter4;

        PreFilters filters5 = new PreFilters();
        PreFilters.PreFilter filter5 = filters5.new PreFilter();
        filter5.setAntennaID((short) 1);
        filter5.setTagPattern("55555");
        filter5.setTagPatternBitCount(4);
        filter5.setBitOffset(32);
        filter5.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter5.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter5.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter5.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter5.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[5] = filter5;

        PreFilters filters6 = new PreFilters();
        PreFilters.PreFilter filter6 = filters6.new PreFilter();
        filter6.setAntennaID((short) 1);
        filter6.setTagPattern("66666");
        filter6.setTagPatternBitCount(4);
        filter6.setBitOffset(32);
        filter6.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter6.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter6.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter6.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter6.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[6] = filter6;

        PreFilters filters7 = new PreFilters();
        PreFilters.PreFilter filter7 = filters7.new PreFilter();
        filter7.setAntennaID((short) 1);
        filter7.setTagPattern("77777");
        filter7.setTagPatternBitCount(4);
        filter7.setBitOffset(32);
        filter7.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter7.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter7.StateAwareAction.setTarget(TARGET.TARGET_SL);
        filter7.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter7.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[7] = filter7;
        // Add to preFilterArray as needed
        

        // not to select tags that match the criteria


        try {
//            Log.d("setSingulationControl", "SingulationControl...");
//
//            Antennas.SingulationControl singulationControl = new Antennas.SingulationControl();
//            //singulationControl // mRfidReader.Config.Antennas.getSingulationControl(1);
//
//            singulationControl.setSession(SESSION.SESSION_S2);
//            singulationControl.setTagPopulation((short) 32);
//            singulationControl.Action.setSLFlag(SL_FLAG.SL_FLAG_ASSERTED);
//            singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_AB_FLIP);
//            // mRfidReader.Config.Antennas.setSingulationControl(1, singulationControl);
            reader.Actions.PreFilters.deleteAll();
            Log.d(TAG, "PreFilter Started adding...................................");
            reader.Actions.PreFilters.add(preFilterArray, null);
            Thread.sleep(500);
            Log.d(TAG, "PreFilter set successfully");
            int prefilterLength = reader.Actions.PreFilters.length();
            Log.d(TAG, "PreFilter length = " + prefilterLength);
            for (int i = 0; i < prefilterLength; i++) {
                PreFilters.PreFilter fil =  reader.Actions.PreFilters.getPreFilter(i);
                Log.d(TAG, "PreFilter: " + fil.getStringTagPattern());
            }

            PreFilters.PreFilter deletefil =  reader.Actions.PreFilters.getPreFilter(5);
            deletefil.setTagPattern("AAAAAAAAAAAAAAAA");
            Log.d(TAG, "Deleting PreFilter: " + deletefil.getStringTagPattern());

            Log.d(TAG, "PreFilter before delete all................ = ");
            reader.Actions.PreFilters.deleteAll();

            Log.d(TAG, "PreFilter add single filter");
            reader.Actions.PreFilters.add(deletefil);


            Log.d(TAG, "PreFilter add 2nd single filter");
            deletefil.setTagPattern("BBBBBBBBBBBBBBBBB");
            PreFilters.PreFilter second = deletefil;
            reader.Actions.PreFilters.add(second);


            Log.d(TAG, "PreFilter add 3nd single filter");
            deletefil.setTagPattern("CCCCCCCCCCCCCCCC");
            reader.Actions.PreFilters.add(deletefil);

            Log.d(TAG, "PreFilter delete single 2nd filter");
            reader.Actions.PreFilters.delete(second);


            Thread.sleep(500);
             prefilterLength = reader.Actions.PreFilters.length();
            Log.d(TAG, "PreFilter after delete length = " + prefilterLength);
            for (int i = 0; i < prefilterLength; i++) {
                PreFilters.PreFilter fil =  reader.Actions.PreFilters.getPreFilter(i);
                Log.d(TAG, "PreFilter: " + fil.getStringTagPattern());
            }

            PreFilters filterss8 = new PreFilters();
            PreFilters.PreFilter filter8 = filterss8.new PreFilter();
            filter8.setAntennaID((short) 1);
            filter8.setTagPattern("88888");
            filter8.setTagPatternBitCount(4);
            filter8.setBitOffset(32);
            filter8.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
            filter8.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
            filter8.StateAwareAction.setTarget(TARGET.TARGET_SL);
            filter8.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
            filter8.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
            preFilterArray[5] = filter8;

            //reader.Actions.PreFilters.add(preFilterArray, null);

            reader.Actions.PreFilters.add(preFilterArray, null);
            Thread.sleep(500);
            Log.d(TAG, "PreFilter 2nd set successfully");
             prefilterLength = reader.Actions.PreFilters.length();
            Log.d(TAG, "PreFilter length = " + prefilterLength);
            for (int i = 0; i < prefilterLength; i++) {
                PreFilters.PreFilter fil =  reader.Actions.PreFilters.getPreFilter(i);
                Log.d(TAG, "PreFilter: " + fil.getStringTagPattern());
            }


            //            reader.Config.setUniqueTagReport(true);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }


    // Enumerates SDK based on host device
    private class CreateInstanceTask extends AsyncTask<Void, Void, Void> {
        private InvalidUsageException invalidUsageException = null;
        @Override
        protected Void doInBackground(Void... voids) {
            Log.d(TAG, "CreateInstanceTask");
            try {
                readers = new Readers(context, ENUM_TRANSPORT.BLUETOOTH);
                availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                if(availableRFIDReaderList.isEmpty()) {
                    Log.d(TAG, "Reader not available in SERVICE_USB Transport trying with BLUETOOTH transport");
                    readers.setTransport(ENUM_TRANSPORT.BLUETOOTH);
                    availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                }
                if(availableRFIDReaderList.isEmpty()) {
                    Log.d(TAG, "Reader not available in BLUETOOTH Transport trying with SERVICE_SERIAL transport");
                    readers.setTransport(ENUM_TRANSPORT.SERVICE_SERIAL);
                    availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                }
                if(availableRFIDReaderList.isEmpty()) {
                    Log.d(TAG, "Reader not available in SERVICE_SERIAL Transport trying with SERVICE_USB transport");
                    readers.setTransport(ENUM_TRANSPORT.SERVICE_USB);
                    availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                }
            } catch (InvalidUsageException e) {
                invalidUsageException = e;
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            super.onPostExecute(aVoid);
            if (invalidUsageException != null) {
                context.sendToast("Failed to get Available Readers\n"+invalidUsageException.getInfo());
                readers = null;
            } else if (availableRFIDReaderList.isEmpty()) {
                context.sendToast("No Available Readers to proceed");
                readers = null;
            } else {
                connectReader();
            }
        }
    }

    private synchronized void connectReader(){
        if(!isReaderConnected()){
            new ConnectionTask().execute();
        }
    }

    private class ConnectionTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... voids) {
            Log.d(TAG, "ConnectionTask");
            GetAvailableReader();
            if (reader != null)
                return connect();
            return "Failed to find or connect reader";
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            textView.setText(result);
        }
    }

    private synchronized void GetAvailableReader() {
        Log.d(TAG, "GetAvailableReader");
        if (readers != null) {
            readers.attach(this);
            try {
                ArrayList<ReaderDevice> availableReaders = readers.GetAvailableRFIDReaderList();
                if (availableReaders != null && !availableReaders.isEmpty()) {
                    availableRFIDReaderList = availableReaders;
                    // if single reader is available then connect it
                    Log.e(TAG,"Available readers to connect = "+availableRFIDReaderList.size());
                    if (availableRFIDReaderList.size() == 1) {
                        readerDevice = availableRFIDReaderList.get(0);
                        reader = readerDevice.getRFIDReader();
                    } else {
                        // search reader specified by name
                        for (ReaderDevice device : availableRFIDReaderList) {
                            Log.d(TAG,"device: "+device.getName());
                            if (device.getName().startsWith(readerName)) {

                                readerDevice = device;
                                reader = readerDevice.getRFIDReader();

                            }
                        }
                    }
                    if( impinjExtensions == null)
                        impinjExtensions = new ImpinjExtensions(reader);
                }
            }catch (InvalidUsageException ie){
                ie.printStackTrace();
            }

        }
    }

    // handler for receiving reader appearance events
    @Override
    public void RFIDReaderAppeared(ReaderDevice readerDevice) {
        Log.d(TAG, "RFIDReaderAppeared " + readerDevice.getName());
        context.sendToast("RFIDReaderAppeared");
        connectReader();
    }

    @Override
    public void RFIDReaderDisappeared(ReaderDevice readerDevice) {
        Log.d(TAG, "RFIDReaderDisappeared " + readerDevice.getName());
        context.sendToast("RFIDReaderDisappeared");
        if (readerDevice.getName().equals(reader.getHostName()))
            disconnect();
    }


    private synchronized String connect() {
        if (reader != null) {
            Log.d(TAG, "connect " + reader.getHostName());
            try {
                if (!reader.isConnected()) {
                    // Establish connection to the RFID Reader
                    reader.connect();
                    ConfigureReader();

                    //Call this function if the readerdevice supports scanner to setup scanner SDK
                    //setupScannerSDK();
                    if(reader.isConnected()){
                        return "Connected: " + reader.getHostName();
                    }

                }
            } catch (InvalidUsageException e) {
                e.printStackTrace();
            } catch (OperationFailureException e) {
                e.printStackTrace();
                Log.d(TAG, "OperationFailureException " + e.getVendorMessage());
                String des = e.getResults().toString();
                return "Connection failed" + e.getVendorMessage() + " " + des;
            }
        }
        return "";
    }

    private void ConfigureReader() {
        Log.d(TAG, "ConfigureReader " + reader.getHostName());
        IRFIDLogger.getLogger("SDKSAmpleApp").EnableDebugLogs(true);
        if (reader.isConnected()) {
            TriggerInfo triggerInfo = new TriggerInfo();
            triggerInfo.StartTrigger.setTriggerType(START_TRIGGER_TYPE.START_TRIGGER_TYPE_IMMEDIATE);
            triggerInfo.StopTrigger.setTriggerType(STOP_TRIGGER_TYPE.STOP_TRIGGER_TYPE_IMMEDIATE);
            try {
                // receive events from reader
                if (eventHandler == null)
                    eventHandler = new EventHandler();
                reader.Events.addEventsListener(eventHandler);
                // HH event
                reader.Events.setHandheldEvent(true);
                // tag event with tag data
                reader.Events.setTagReadEvent(true);
                reader.Events.setAttachTagDataWithReadEvent(false);
                // set trigger mode as rfid so scanner beam will not come
                reader.Config.setTriggerMode(ENUM_TRIGGER_MODE.RFID_MODE, true);
                // set start and stop triggers
                reader.Config.setStartTrigger(triggerInfo.StartTrigger);
                reader.Config.setStopTrigger(triggerInfo.StopTrigger);
                // power levels are index based so maximum power supported get the last one
                MAX_POWER = reader.ReaderCapabilities.getTransmitPowerLevelValues().length - 1;
                // set antenna configurations
                Antennas.AntennaRfConfig config = reader.Config.Antennas.getAntennaRfConfig(1);
                config.setTransmitPowerIndex(MAX_POWER);
                config.setrfModeTableIndex(0);
                config.setTari(0);
                reader.Config.Antennas.setAntennaRfConfig(1, config);
                // Set the singulation control
                Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
                s1_singulationControl.setSession(SESSION.SESSION_S0);
                s1_singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_A);
                s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
                reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
                // delete any prefilters
                //reader.Actions.PreFilters.deleteAll();
                //
                int prefilterNo = reader.Actions.PreFilters.length();
                Log.d(TAG, "Prefilters count: " + prefilterNo);
                reader.Actions.PreFilters.deleteAll();
              //  setPreFilters();
            } catch (InvalidUsageException | OperationFailureException e) {
                e.printStackTrace();
            }
        }
    }


/*

    void onDestroy() {
        dispose();
    }

    String onResume() {
        return connect();
    }

    void onPause() {
        disconnect();
    }
*/

/*
    private synchronized String connect() {
        Log.d(TAG, "connect");
        if (reader != null) {
            try {
                if (!reader.isConnected()) {
                    // Establish connection to the RFID Reader
                    reader.connect();
                    ConfigureReader();

                    setupScannerSDK();
                    return "Connected";
                }
            } catch (InvalidUsageException e) {
                //e.printStackTrace();
            } catch (OperationFailureException e) {
                //e.printStackTrace();
                Log.d(TAG, "OperationFailureException " + e.getVendorMessage());
                return "Connection failed" + e.getVendorMessage() + " " + e.getStatusDescription();
            }
        }
        return "";
    }

    private void ConfigureReader() {
        if (reader.isConnected()) {
            TriggerInfo triggerInfo = new TriggerInfo();
            triggerInfo.StartTrigger.setTriggerType(START_TRIGGER_TYPE.START_TRIGGER_TYPE_IMMEDIATE);
            triggerInfo.StopTrigger.setTriggerType(STOP_TRIGGER_TYPE.STOP_TRIGGER_TYPE_IMMEDIATE);
            try {
                // receive events from reader
                if (eventHandler == null)
                    eventHandler = new EventHandler();
                reader.Events.addEventsListener(eventHandler);
                // HH event
                reader.Events.setHandheldEvent(true);
                // tag event with tag data
                reader.Events.setTagReadEvent(true);
                reader.Events.setAttachTagDataWithReadEvent(false);
                reader.Events.setReaderDisconnectEvent(true);

                reader.Config.setTriggerMode(ENUM_TRIGGER_MODE.RFID_MODE, false);
                // set start and stop triggers
                reader.Config.setStartTrigger(triggerInfo.StartTrigger);
                reader.Config.setStopTrigger(triggerInfo.StopTrigger);

            } catch (InvalidUsageException | OperationFailureException e) {
                //e.printStackTrace();
            }
        }
    }
*/

    public void setupScannerSDK(){
        if (sdkHandler == null)
        {
            sdkHandler = new SDKHandler(context);
            //For cdc device
            DCSSDKDefs.DCSSDK_RESULT result = sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_USB_CDC);

            //For bluetooth device
           DCSSDKDefs.DCSSDK_RESULT btResult = sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_BT_LE);
            DCSSDKDefs.DCSSDK_RESULT btNormalResult = sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_BT_NORMAL);

            Log.d(TAG,btNormalResult+ " results "+ btResult);
            sdkHandler.dcssdkSetDelegate(this);

            int notifications_mask = 0;
            // We would like to subscribe to all scanner available/not-available events
            notifications_mask |= DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SCANNER_APPEARANCE.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SCANNER_DISAPPEARANCE.value;

            // We would like to subscribe to all scanner connection events
            notifications_mask |= DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_BARCODE.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_BARCODE.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SESSION_ESTABLISHMENT.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SESSION_TERMINATION.value;


            // We would like to subscribe to all barcode events
            // subscribe to events set in notification mask
            sdkHandler.dcssdkSubsribeForEvents(notifications_mask);
        }
        if (sdkHandler != null)
        {
            ArrayList<DCSScannerInfo> availableScanners = new ArrayList<>();
            availableScanners  = (ArrayList<DCSScannerInfo>) sdkHandler.dcssdkGetAvailableScannersList();

            scannerList.clear();
            if (availableScanners != null)
            {
                for (DCSScannerInfo scanner : availableScanners)
                {

                    scannerList.add(scanner);
                }
            }
            else
                Log.d(TAG,"Available scanners null");

        }
        if (reader != null )
        {
            for (DCSScannerInfo device : scannerList)
            {
                if (device.getScannerName().contains(reader.getHostName()))
                {
                    try
                    {
                        sdkHandler.dcssdkEstablishCommunicationSession(device.getScannerID());
                        scannerID= device.getScannerID();
                    }
                    catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private synchronized void disconnect() {
        Log.d(TAG, "Disconnect");
        try {
            if (reader != null) {
                if (eventHandler != null)
                    reader.Events.removeEventsListener(eventHandler);
                if (sdkHandler != null) {
                    sdkHandler.dcssdkTerminateCommunicationSession(scannerID);
                    scannerList = null;
                }
                reader.disconnect();
                context.sendToast("Disconnecting reader");
                //reader = null;
            }
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private synchronized void dispose() {
        disconnect();
        try {
            if (reader != null) {
                //Toast.makeText(getApplicationContext(), "Disconnecting reader", Toast.LENGTH_LONG).show();
                reader = null;
                readers.Dispose();
                readers = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    synchronized void performInventory() {
        try {
            reader.Actions.Inventory.perform();
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        }
    }

    synchronized void stopInventory() {
        try {
            reader.Actions.Inventory.stop();
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        }
    }
    public void scanCode(){
        String in_xml = "<inArgs><scannerID>" + scannerID+ "</scannerID></inArgs>";
        cmdExecTask = new MyAsyncTask(scannerID, DCSSDKDefs.DCSSDK_COMMAND_OPCODE.DCSSDK_DEVICE_PULL_TRIGGER, null);
        cmdExecTask.execute(new String[]{in_xml});
    }

    private class MyAsyncTask extends AsyncTask<String, Integer, Boolean> {
        int scannerId;
        StringBuilder outXML;
        DCSSDKDefs.DCSSDK_COMMAND_OPCODE opcode;
        ///private CustomProgressDialog progressDialog;

        public MyAsyncTask(int scannerId, DCSSDKDefs.DCSSDK_COMMAND_OPCODE opcode, StringBuilder outXML) {
            this.scannerId = scannerId;
            this.opcode = opcode;
            this.outXML = outXML;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();

        }


        @Override
        protected Boolean doInBackground(String... strings) {
            return executeCommand(opcode, strings[0], outXML, scannerId);
        }

        @Override
        protected void onPostExecute(Boolean b) {
            super.onPostExecute(b);
        }
    }
    public boolean executeCommand(DCSSDKDefs.DCSSDK_COMMAND_OPCODE opCode, String inXML, StringBuilder outXML, int scannerID) {
        if (sdkHandler != null)
        {
            if(outXML == null){
                outXML = new StringBuilder();
            }
            DCSSDKDefs.DCSSDK_RESULT result=sdkHandler.dcssdkExecuteCommandOpCodeInXMLForScanner(opCode,inXML,outXML,scannerID);
            Log.d(TAG, "execute command returned " + result.toString() );
            if(result== DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SUCCESS)
                return true;
            else if(result==DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_FAILURE)
                return false;
        }
        return false;
    }
    // Read/Status Notify handler
    // Implement the RfidEventsLister class to receive event notifications
    public class EventHandler implements RfidEventsListener {
        // Read Event Notification
        public void eventReadNotify(RfidReadEvents e) {
            TagData[] myTags = reader.Actions.getReadTags(100);
            if (myTags != null) {
                for (int index = 0; index < myTags.length; index++) {
                    //  Log.d(TAG, "Tag ID " + myTags[index].getTagID());
                    Log.d(TAG, "Tag ID" + myTags[index].getTagID() +"RSSI value "+ myTags[index].getPeakRSSI());
                    Log.d(TAG, "RSSI value "+ myTags[index].getPeakRSSI());
                    /* To get the RSSI value*/   //   Log.d(TAG, "RSSI value "+ myTags[index].getPeakRSSI());

                }
                new AsyncDataUpdate().execute(myTags);
            }
        }

        // Status Event Notification
        public void eventStatusNotify(RfidStatusEvents rfidStatusEvents) {
            Log.d(TAG, "Status Notification: " + rfidStatusEvents.StatusEventData.getStatusEventType());
            if (rfidStatusEvents.StatusEventData.getStatusEventType() == STATUS_EVENT_TYPE.HANDHELD_TRIGGER_EVENT) {
                if (rfidStatusEvents.StatusEventData.HandheldTriggerEventData.getHandheldEvent() == HANDHELD_TRIGGER_EVENT_TYPE.HANDHELD_TRIGGER_PRESSED) {
                    new AsyncTask<Void, Void, Void>() {
                        @Override
                        protected Void doInBackground(Void... voids) {
                            Log.d(TAG,"HANDHELD_TRIGGER_PRESSED");
                            context.handleTriggerPress(true);
                            return null;
                        }
                    }.execute();
                }
                if (rfidStatusEvents.StatusEventData.HandheldTriggerEventData.getHandheldEvent() == HANDHELD_TRIGGER_EVENT_TYPE.HANDHELD_TRIGGER_RELEASED) {
                    new AsyncTask<Void, Void, Void>() {
                        @Override
                        protected Void doInBackground(Void... voids) {
                            context.handleTriggerPress(false);
                            Log.d(TAG,"HANDHELD_TRIGGER_RELEASED");
                            return null;
                        }
                    }.execute();
                }
            }
            if (rfidStatusEvents.StatusEventData.getStatusEventType() == STATUS_EVENT_TYPE.DISCONNECTION_EVENT) {
                new AsyncTask<Void, Void, Void>() {
                    @Override
                    protected Void doInBackground(Void... voids) {

                        disconnect();
                        return null;
                    }
                }.execute();
            }

        }
    }

    private class AsyncDataUpdate extends AsyncTask<TagData[], Void, Void> {
        @Override
        protected Void doInBackground(TagData[]... params) {
            context.handleTagdata(params[0]);

            return null;
        }
    }

    interface ResponseHandlerInterface {
        void handleTagdata(TagData[] tagData);

        void handleTriggerPress(boolean pressed);

        void barcodeData(String val);
        void sendToast(String val);
        //void handleStatusEvents(Events.StatusEventData eventData);
    }

    //M781 - E28011112222333344445555 passowrd - 00000000
    // E28011C1A5000062F792696D
    public String impinjTag ;

    public String password ;
    public String enableImpinjVisibility() {
        try {
            impinjExtensions.enableTagVisibility(password, (short) 1);
            //reader.enableImpinjVisibility("","");
        } catch (OperationFailureException e) {
            e.printStackTrace();
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        }

        return  "Impinj Visibility Enabled";
    }

    public String disableImpinjVisibilty() {
        try {
            impinjExtensions.disableTagVisibility(password, (short) 1);
            //reader.enableImpinjVisibility("","");
        }  catch (OperationFailureException | InvalidUsageException | IllegalStateException e) {
            e.printStackTrace();
            Log.d(TAG, "Impinj Disable Visibility exception " + e.getMessage());
            return "Failed to disable Impinj Visibility: " + e.getMessage();
        }
        return  "Impinj Visibility disabled";
    }


    public String enableImpinjProtection() {
        try {
            TagData tagData = new TagData();
            impinjExtensions.enableTagProtection(impinjTag, password, tagData);

        } catch (OperationFailureException | InvalidUsageException e) {
            e.printStackTrace();
            return "Failed to enable Impinj Protection: " + e.getMessage();
        }
        return "Impinj Protection Enabled";
    }

    public String disableImpinjProtection() {
        try {
            TagData tagData = new TagData();
            impinjExtensions.disableTagProtection(impinjTag, password,tagData, (short) 1);
            // return " Impinj Protection Disabled";
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return "Failed ";
        } catch (InvalidUsageException e) {
            e.printStackTrace();
            return "Failed ";
        }

        //String tagId = "1234ABCD00000000000025B1";

        return "Impinj Protection Disabled";
    }

    public String tagFocus(boolean tagFocus) {
        try {
            impinjExtensions.setTagFocus(tagFocus, (short) 1);
            return "Success";
        } catch (InvalidUsageException e) {
            e.printStackTrace();
            return "fail";

        } catch (OperationFailureException e) {
            e.printStackTrace();
            Log.d(TAG,"Tag focus exception "+e.getMessage()+ e.getVendorMessage());
            return "Fail";

        }catch (IllegalStateException e) {
            e.printStackTrace();
            Log.d(TAG,"Tag focus exception "+e.getMessage());
            return "Fail";
        }
    }

    //    D4 - S2
//11010100
//
//    F5 - S3
//11110101
//
//        90 - S0
//10010000
//    B1  - S3
//10110001
    public String tagQuiet(ENUM_TAGQUIET_MASK[] tagMask, TARGET target, STATE_AWARE_ACTION stateAwareAction) {
        try {
            impinjExtensions.setTagQuiet(tagMask,target,stateAwareAction,(short) 1);
        }catch (InvalidUsageException e) {
            e.printStackTrace();
            return "fail";

        } catch (OperationFailureException e) {
            e.printStackTrace();
            return "Fail";
        }

        return "Tagquiet Set to TID mask " ;
    }

    public String singulation(SESSION session, INVENTORY_STATE inventoryState){
        try {
            Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
            s1_singulationControl.setSession(session);
            s1_singulationControl.Action.setInventoryState(inventoryState);
            s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
            reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Session set to "+ session.toString()+ " " + "Inventory State set to " + inventoryState.toString();
    }

    public  String setPrefilter(MEMORY_BANK mb, STATE_AWARE_ACTION stateAwareAction, TARGET target, String tagPattern, int offset, int length) {
        PreFilters preFilters = new PreFilters();
        PreFilters.PreFilter filter = preFilters.new PreFilter();
        filter.setAntennaID((short) 1);
        filter.setBitOffset(offset);
        filter.setTagPatternBitCount(length);
        filter.setTagPattern(tagPattern);
        filter.setMemoryBank(mb);
        filter.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
        filter.StateAwareAction.setTarget(target);
        filter.StateAwareAction.setStateAwareAction(stateAwareAction);

        try {
            reader.Actions.PreFilters.add(filter);
        } catch (InvalidUsageException e) {
            throw new RuntimeException(e);
        } catch (OperationFailureException e) {
            throw new RuntimeException(e);
        }
        return "Prefilter set true";
    }

//    public String removeTagQuiet() {
//        try {
//            impinjExtensions.removeTagQuiet();
//        } catch (InvalidUsageException e) {
//            e.printStackTrace();
//            return "fail";
//
//        } catch (OperationFailureException e) {
//            e.printStackTrace();
//            return "Fail";
//        }catch (IllegalStateException e) {
//            e.printStackTrace();
//            Log.d(TAG,"Tag quiet exception "+e.getMessage());
//            return "Fail";
//        }
//        return "Tagquiet removed";
//    }


}
