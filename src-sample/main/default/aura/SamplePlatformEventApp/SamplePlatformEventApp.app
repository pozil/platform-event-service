<aura:application extends="force:slds">
    <!-- Page header -->
    <div class="slds-page-header" style="border-bottom: 1px solid #dddbda; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);">
        <div class="slds-media">
            <div class="slds-media__figure">
                <lightning:icon iconName="utility:broadcast" size="normal" alternativeText="Platform event icon"/>
            </div>
            <div class="slds-media__body">
                <h1 class="slds-page-header__title slds-truncate slds-align-middle">Platform Event Service Component Sample App</h1>
                <p class="slds-text-body_small slds-line-height_reset">See the Platform Event Service Component at work and experiment with it</p>
            </div>
        </div>
    </div>

    <!-- Page body -->
    <div style="max-width: 850px; margin: 2rem auto;">
        <div class="slds-box slds-theme_default slds-theme_alert-texture slds-m-bottom_small">
            <div class="slds-media slds-media_center">
                <div class="slds-media__figure">
                    <lightning:icon iconName="utility:info" alternativeText="Info" size="small"/>
                </div>
                <div class="slds-media__body">
                    <p>Run this sample component in the Lightning Experience for an improved user experience.<br/>
                    To do so, drag and drop it in a Lightning page using the App Builder</p>
                </div>
            </div>
        </div>
        <c:SamplePlatformEventService/>
    </div>
</aura:application>