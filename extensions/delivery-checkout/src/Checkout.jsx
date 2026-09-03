import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { 
  useShippingAddress,
  useApplyAttributeChange 
} from '@shopify/ui-extensions/checkout/preact';

export default async () => {
  render(<CityDiscount />, document.body);
};

function CityDiscount() {
  const shippingAddress = useShippingAddress();
  const applyAttributeChange = useApplyAttributeChange();

  useEffect(() => {
    if (!shippingAddress?.city) {
      console.log("⏳ Waiting for shipping address...");
      return;
    }

    const cityRaw = (shippingAddress.city || '').toLowerCase().trim();
    const provinceCode = (shippingAddress.provinceCode || '').toLowerCase().trim();

    console.log(`📍 Detected → City: "${cityRaw}" | Province: "${provinceCode}"`);

    let eligibleCity = '';

    // Delhi Check
    if ((cityRaw === 'delhi' || cityRaw === 'new delhi') && provinceCode === 'dl') {
      eligibleCity = 'delhi';
      console.log("✅ Valid Delhi detected");
    }
    // Mumbai Check
    else if (cityRaw === 'mumbai' && provinceCode === 'mh') {
      eligibleCity = 'mumbai';
      console.log("✅ Valid Mumbai detected");
    } 
    else {
      console.log(`❌ Not eligible: ${cityRaw} (${provinceCode})`);
    }

    // Apply / Update Cart Attribute
    const changeType = eligibleCity ? "updateAttribute" : "removeAttribute";   // ← Yeh sahi hai

    applyAttributeChange({
      type: changeType,                    // ← "updateAttribute" ya "removeAttribute"
      key: "eligible_city",
      value: eligibleCity                  // empty string bhi bhej sakte ho remove ke liye
    }).then((result) => {
      if (result.type === 'success') {
        console.log(`✅ Attribute ${changeType} successful: eligible_city = "${eligibleCity}"`);
      } else {
        console.error("❌ Failed to update attribute:", result);
      }
    });

  }, [shippingAddress, applyAttributeChange]);

  return null;
}