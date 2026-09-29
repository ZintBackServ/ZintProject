const BASE_URL = "https://zintinstitute.in";

/**
 * Injects or updates a JSON-LD structured data script element in the head.
 * @param {string} id - Unique ID for the script tag
 * @param {object} data - JSON-LD object
 */
export function setStructuredData(id, data) {
  if (typeof document === "undefined") return;
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Removes a JSON-LD script by ID
 */
export function removeStructuredData(id) {
  if (typeof document === "undefined") return;
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

/**
 * Builds Course schema (Google Rich Results compliant)
 */
export function buildCourseSchema(course) {
  if (!course) return null;

  const url = `${BASE_URL}/courses/${course.slug || course._id}`;
  const courseImage = course.courseImage?.startsWith("http")
    ? course.courseImage
    : `${BASE_URL}${course.courseImage?.startsWith("/") ? "" : "/"}${course.courseImage || "image.png"}`;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${course.courseName} in Gwalior`,
    "description": course.about || `${course.courseName} training course at Zint Institute Gwalior with practical projects and 100% placement support.`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Zint Computer Education Institute",
      "url": BASE_URL,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gwalior",
        "addressRegion": "Madhya Pradesh",
        "addressCountry": "IN"
      }
    },
    "image": courseImage,
    "url": url,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": course.mode === "Online" ? "online" : course.mode === "Offline" ? "onsite" : "blended",
      "courseWorkload": course.duration || "PT2H/day",
      "location": {
        "@type": "Place",
        "name": "Zint Institute Main Campus",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Gwalior",
          "addressRegion": "Madhya Pradesh",
          "addressCountry": "IN"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": course.fee || course.online_fee || "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "category": "Tuition"
      }
    }
  };
}

/**
 * Builds FAQPage schema
 */
export function buildFaqSchema(faqList) {
  if (!Array.isArray(faqList) || faqList.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": (item.q || "").replace(/^\d+\.\s*/, ""),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a || ""
      }
    }))
  };
}

/**
 * Builds BreadcrumbList schema
 */
export function buildBreadcrumbSchema(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`
    }))
  };
}

/**
 * Builds Event schema
 */
export function buildEventSchema(event) {
  if (!event) return null;

  const eventImage = event.eventImage?.startsWith("http")
    ? event.eventImage
    : `${BASE_URL}${event.eventImage?.startsWith("/") ? "" : "/"}${event.eventImage || "image.png"}`;

  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "name": event.name,
    "description": event.about || `${event.name} at Zint Computer Education Institute, Gwalior.`,
    "startDate": event.date ? new Date(event.date).toISOString() : undefined,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.place || "Zint Institute Main Campus, Gwalior",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gwalior",
        "addressRegion": "Madhya Pradesh",
        "addressCountry": "IN"
      }
    },
    "image": [eventImage],
    "organizer": {
      "@type": "EducationalOrganization",
      "name": "Zint Computer Education Institute",
      "url": BASE_URL
    }
  };
}
