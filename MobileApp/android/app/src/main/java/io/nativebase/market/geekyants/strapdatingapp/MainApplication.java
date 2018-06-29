package io.nativebase.market.geekyants.strapdatingapp;

import android.app.Application;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import io.sentry.RNSentryPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.imagepicker.ImagePickerPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.CallbackManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new LocationServicesDialogBoxPackage(), new RNSentryPackage(MainApplication.this),
          new SplashScreenReactPackage(), new RNI18nPackage(), new ImagePickerPackage(),
          new ReactNativeOneSignalPackage(), new ReactNativePushNotificationPackage(),
          new FBSDKPackage(mCallbackManager), new LinearGradientPackage(), new RNDeviceInfo());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
