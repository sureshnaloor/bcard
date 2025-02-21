import type { VCardData } from "@/types/vcard"

export function generateVCardString(userData: VCardData): string {
  const lastName = userData.lastName?.trim() || ''
  const firstName = userData.firstName?.trim() || ''
  const middleName = userData.middleName?.trim() || ''
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

  return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};${middleName};;;
FN:${fullName}
${userData.organization ? `ORG:${userData.organization}\n` : ''}
${userData.title ? `TITLE:${userData.title}\n` : ''}
${userData.workEmail ? `EMAIL;type=WORK:${userData.workEmail}\n` : ''}
${userData.personalEmail ? `EMAIL;type=HOME:${userData.personalEmail}\n` : ''}
${userData.mobilePhone ? `TEL;type=CELL:${userData.mobilePhone}\n` : ''}
${userData.workPhone ? `TEL;type=WORK:${userData.workPhone}\n` : ''}
${userData.homePhone ? `TEL;type=HOME:${userData.homePhone}\n` : ''}
${userData.fax ? `TEL;type=FAX:${userData.fax}\n` : ''}
${userData.website ? `URL:${userData.website}\n` : ''}
${userData.workStreet ? `ADR;type=WORK:;;${userData.workStreet};${userData.workCity || ''};${userData.workState || ''};${userData.workPostalCode || ''};${userData.workCountry || ''}\n` : ''}
${userData.linkedin ? `X-SOCIALPROFILE;type=linkedin:${userData.linkedin}\n` : ''}
${userData.twitter ? `X-SOCIALPROFILE;type=twitter:${userData.twitter}\n` : ''}
${userData.facebook ? `X-SOCIALPROFILE;type=facebook:${userData.facebook}\n` : ''}
${userData.instagram ? `X-SOCIALPROFILE;type=instagram:${userData.instagram}\n` : ''}
${userData.youtube ? `X-SOCIALPROFILE;type=youtube:${userData.youtube}\n` : ''}
${userData.github ? `X-SOCIALPROFILE;type=github:${userData.github}\n` : ''}
${userData.notes ? `NOTE:${userData.notes}\n` : ''}
END:VCARD`.replace(/\n+/g, '\n')
} 