export function cartLinesDiscountsGenerateRun(input) {
  console.log("=== SMART COMBINED DISCOUNT - FIXED ===");

  let city = "";

  // City detect karo
  if (input.cart.attribute?.value) {
    city = input.cart.attribute.value.toLowerCase().trim();
  } else if (input.cart.deliveryGroups?.[0]?.deliveryAddress?.city) {
    city = input.cart.deliveryGroups[0].deliveryAddress.city.toLowerCase().trim();
  }

  console.log(`Detected City: "${city}"`);

  const candidates = [];

  // Har line (product) ke liye discount calculate karo
  input.cart.lines.forEach((line) => {
    const vendor = (line.merchandise?.product?.vendor || "").toLowerCase().trim();
    let discountPercent = 0;
    let message = "";

    const isMojitoX = vendor.includes("mojitox");
    const isMojitoY = vendor.includes("mojitoy");

    // Combined City + Brand Logic
    if (city === "delhi" || city === "new delhi") {
      if (isMojitoX) {
        discountPercent = 25;
        message = "🎉 Delhi + MojitoX - 25% OFF";
      } else if (isMojitoY) {
        discountPercent = 35;
        message = "🎉 Delhi + MojitoY - 35% OFF";
      }
    } 
    else if (city === "mumbai") {
      if (isMojitoX) {
        discountPercent = 35;
        message = "🎉 Mumbai + MojitoX - 35% OFF";
      } else if (isMojitoY) {
        discountPercent = 45;
        message = "🎉 Mumbai + MojitoY - 45% OFF";
      }
    } 
    else {
      // Other cities
      if (isMojitoX) {
        discountPercent = 15;
        message = "🎉 MojitoX Special - 15% OFF";
      } else if (isMojitoY) {
        discountPercent = 25;
        message = "🎉 MojitoY Special - 25% OFF";
      }
    }

    if (discountPercent > 0) {
      candidates.push({
        targets: [{ cartLine: { id: line.id } }],
        value: { percentage: { value: discountPercent } },
        message: message
      });

      console.log(`✅ ${discountPercent}% applied on ${vendor} (City: ${city})`);
    } else {
      console.log(`No discount on line: ${vendor}`);
    }
  });

  // Final Output
  if (candidates.length === 0) {
    console.log("❌ No discount applicable");
    return { operations: [] };
  }

  return {
    operations: [
      {
        productDiscountsAdd: {
          selectionStrategy: "ALL",
          candidates: candidates   // Sab candidates ek hi operation mein
        }
      }
    ]
  };
}