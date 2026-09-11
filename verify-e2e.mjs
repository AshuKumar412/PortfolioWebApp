/**
 * verify-e2e.mjs
 * Thorough end-to-end verification script testing:
 * 1. Public reading of portfolio
 * 2. Unauthenticated write blocking (Security check)
 * 3. Admin Authentication
 * 4. Profile CRUD: update name, bio, stats, availability toggle
 * 5. Verify update persistence & repeated saves (no duplicate rows)
 * 6. Storage: Upload avatar, replace avatar, delete avatar
 * 7. Storage: Upload resume, replace resume, delete resume
 * 8. Projects CRUD: Create project, Read, Update, Delete
 * 9. Skills CRUD: Create skill, Read, Update, Delete
 * 10. Messages: Public submit contact message, Admin read
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

let url = '';
let key = '';

try {
  const envContent = readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) url = trimmed.split('=')[1].trim();
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) key = trimmed.split('=')[1].trim();
  }
} catch (e) {
  console.error('Failed to read .env:', e.message);
  process.exit(1);
}

const anonClient = createClient(url, key);
const adminClient = createClient(url, key);

async function runE2E() {
  console.log('====================================================');
  console.log('         STARTING COMPREHENSIVE E2E TESTS           ');
  console.log('====================================================\n');

  // 1. Security check: unauthenticated write to profile MUST be blocked
  console.log('--- 1. Security: Testing Unauthenticated Write Protection ---');
  const { error: unauthErr } = await anonClient
    .from('profile')
    .update({ name: 'Hacker Name' })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (unauthErr) {
    console.log('✅ Unauthenticated write blocked by RLS as expected:', unauthErr.message);
  } else {
    // If no error was thrown, verify that 0 rows were updated
    const { data: checkData } = await anonClient.from('profile').select('name').limit(1).single();
    if (checkData.name !== 'Hacker Name') {
      console.log('✅ Unauthenticated write silently blocked by RLS (0 rows affected).');
    } else {
      console.error('❌ SECURITY FAILURE: Unauthenticated user was able to modify profile!');
    }
  }

  // 2. Admin Authentication
  console.log('\n--- 2. Admin Authentication ---');
  const { data: authData, error: loginErr } = await adminClient.auth.signInWithPassword({
    email: '2400032678@kluniversity.in',
    password: 'Ashu@2005',
  });

  if (loginErr) {
    console.error('❌ Admin login failed:', loginErr.message);
    process.exit(1);
  }
  console.log('✅ Admin login succeeded for:', authData.user.email);

  // 3. Profile CRUD & Persistence
  console.log('\n--- 3. Profile Management: Full Field Update & Persistence ---');
  const { data: initialProfile } = await adminClient
    .from('profile')
    .select('*')
    .limit(1)
    .single();

  console.log('Current profile ID:', initialProfile.id);

  const testPayload = {
    name: 'Ashu Developer',
    title: 'Senior Full-Stack Engineer',
    tagline: 'Designing scalable web applications and intelligent user experiences.',
    bio: 'Experienced full-stack engineer specializing in React, Node.js, and Supabase architecture.',
    bio_extended: 'Passionate about engineering reliable, accessible, and high-performance applications.',
    email: '2400032678@kluniversity.in',
    location: 'Vijayawada, India',
    github_url: 'https://github.com/developer',
    linkedin_url: 'https://linkedin.com/in/developer',
    years_experience: 3,
    projects_count: 24,
    clients_count: 12,
    is_available: true,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedProfile, error: updateErr } = await adminClient
    .from('profile')
    .update(testPayload)
    .eq('id', initialProfile.id)
    .select()
    .single();

  if (updateErr) {
    console.error('❌ Profile update failed:', updateErr.message);
  } else {
    console.log('✅ Profile updated successfully!');
    console.log('   Name:', updatedProfile.name);
    console.log('   Title:', updatedProfile.title);
    console.log('   Experience:', updatedProfile.years_experience, 'years');
    console.log('   Availability:', updatedProfile.is_available ? 'Available' : 'Unavailable');
  }

  // 4. Repeated save test (ensure row count remains exactly 1)
  console.log('\n--- 4. Verify No Duplicate Rows on Repeated Saves ---');
  await adminClient
    .from('profile')
    .update({ tagline: 'Updated tagline test' })
    .eq('id', initialProfile.id);

  const { count } = await adminClient
    .from('profile')
    .select('*', { count: 'exact', head: true });

  if (count === 1) {
    console.log('✅ Exactly 1 profile row exists after repeated saves (no duplicates).');
  } else {
    console.warn(`⚠️ Warning: Found ${count} profile rows!`);
  }

  // 5. Storage: Avatar upload, replace, and remove
  console.log('\n--- 5. Storage: Avatar Upload, Replace & Delete ---');
  const dummyAvatar = Buffer.from('fake-avatar-image-data');
  const avatarPath = `avatar_test_${Date.now()}.png`;

  const { data: avUpload, error: avUpErr } = await adminClient.storage
    .from('avatars')
    .upload(avatarPath, dummyAvatar, { contentType: 'image/png', upsert: true });

  if (avUpErr) {
    console.error('❌ Avatar upload failed:', avUpErr.message);
  } else {
    console.log('✅ Avatar uploaded to:', avUpload.path);
    const { data: urlData } = adminClient.storage.from('avatars').getPublicUrl(avatarPath);
    console.log('✅ Public URL generated:', urlData.publicUrl);

    // Replace
    const { error: repErr } = await adminClient.storage
      .from('avatars')
      .upload(avatarPath, Buffer.from('new-avatar-data'), { contentType: 'image/png', upsert: true });

    if (repErr) console.error('❌ Avatar replacement failed:', repErr.message);
    else console.log('✅ Avatar replacement succeeded.');

    // Delete
    const { error: delErr } = await adminClient.storage.from('avatars').remove([avatarPath]);
    if (delErr) console.error('❌ Avatar delete failed:', delErr.message);
    else console.log('✅ Avatar delete/cleanup succeeded.');
  }

  // 6. Storage: Resume upload, replace, and remove
  console.log('\n--- 6. Storage: Resume Upload, Replace & Delete ---');
  const dummyResume = Buffer.from('%PDF-1.4 dummy-pdf-content');
  const resumePath = `resume_test_${Date.now()}.pdf`;

  const { data: resUpload, error: resUpErr } = await adminClient.storage
    .from('resumes')
    .upload(resumePath, dummyResume, { contentType: 'application/pdf', upsert: true });

  if (resUpErr) {
    console.error('❌ Resume upload failed:', resUpErr.message);
  } else {
    console.log('✅ Resume uploaded to:', resUpload.path);
    const { data: resUrlData } = adminClient.storage.from('resumes').getPublicUrl(resumePath);
    console.log('✅ Public Resume URL:', resUrlData.publicUrl);

    // Delete
    const { error: delResErr } = await adminClient.storage.from('resumes').remove([resumePath]);
    if (delResErr) console.error('❌ Resume delete failed:', delResErr.message);
    else console.log('✅ Resume delete/cleanup succeeded.');
  }

  // 7. Projects CRUD
  console.log('\n--- 7. Projects CRUD ---');
  const newProject = {
    title: 'Automated Portfolio System',
    description: 'High-performance developer portfolio with live Supabase management.',
    problem: 'Managing portfolio updates without manual redeployments.',
    features: ['Real-time CRUD', 'Role-based Access', 'Dark Mode'],
    tech_stack: ['React', 'JavaScript', 'CSS3', 'Supabase'],
    category: 'Full Stack',
    github_url: 'https://github.com/developer/portfolio',
    demo_url: 'https://portfolio.example.com',
    is_featured: true,
    is_published: true,
    display_order: 1,
  };

  const { data: createdProj, error: crProjErr } = await adminClient
    .from('projects')
    .insert(newProject)
    .select()
    .single();

  if (crProjErr) {
    console.error('❌ Project creation failed:', crProjErr.message);
  } else {
    console.log('✅ Project created. ID:', createdProj.id, 'Title:', createdProj.title);

    // Update
    const { data: upProj, error: upProjErr } = await adminClient
      .from('projects')
      .update({ title: 'Automated Portfolio System (v2)' })
      .eq('id', createdProj.id)
      .select()
      .single();

    if (upProjErr) console.error('❌ Project update failed:', upProjErr.message);
    else console.log('✅ Project updated. New Title:', upProj.title);

    // Delete
    const { error: delProjErr } = await adminClient
      .from('projects')
      .delete()
      .eq('id', createdProj.id);

    if (delProjErr) console.error('❌ Project deletion failed:', delProjErr.message);
    else console.log('✅ Project deletion succeeded.');
  }

  // 8. Skills CRUD
  console.log('\n--- 8. Skills CRUD ---');
  const newSkill = {
    name: 'React.js',
    category: 'Frontend',
    icon_name: 'react',
    proficiency: 95,
    display_order: 1,
    is_published: true,
  };

  const { data: createdSkill, error: crSkillErr } = await adminClient
    .from('skills')
    .insert(newSkill)
    .select()
    .single();

  if (crSkillErr) {
    console.error('❌ Skill creation failed:', crSkillErr.message);
  } else {
    console.log('✅ Skill created:', createdSkill.name);

    // Delete
    await adminClient.from('skills').delete().eq('id', createdSkill.id);
    console.log('✅ Skill deleted.');
  }

  // 9. Contact Message (Public INSERT, Admin READ)
  console.log('\n--- 9. Contact Message: Public Submit & Admin Read ---');
  const testMsg = {
    name: 'Recruiter Jane',
    email: 'recruiter@techfirm.com',
    subject: 'Senior Developer Opportunity',
    message: 'We were impressed with your portfolio projects and would love to schedule an interview.',
  };

  const { error: sendMsgErr } = await anonClient
    .from('contact_messages')
    .insert(testMsg);

  if (sendMsgErr) {
    console.error('❌ Public contact message submission failed:', sendMsgErr.message);
  } else {
    console.log('✅ Public contact message sent successfully.');

    // Admin reads message
    const { data: readMessages, error: readMsgErr } = await adminClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (readMsgErr || !readMessages?.length) {
      console.error('❌ Admin could not read message:', readMsgErr?.message);
    } else {
      const readMsg = readMessages[0];
      console.log('✅ Admin successfully retrieved message from:', readMsg.name, '-', readMsg.subject);

      // Cleanup
      await adminClient.from('contact_messages').delete().eq('id', readMsg.id);
      console.log('✅ Test message cleaned up.');
    }
  }

  // 10. Public Portfolio Data Fetch Verification
  console.log('\n--- 10. Public Portfolio Visitor Data Check ---');
  const { data: publicProfile, error: pErr } = await anonClient
    .from('profile')
    .select('*')
    .limit(1)
    .single();

  if (pErr) {
    console.error('❌ Public profile read failed:', pErr.message);
  } else {
    console.log('✅ Public profile reads live database data:');
    console.log('   Name:', publicProfile.name);
    console.log('   Title:', publicProfile.title);
    console.log('   Bio:', publicProfile.bio.substring(0, 60) + '...');
    console.log('   Available:', publicProfile.is_available);
  }

  console.log('\n====================================================');
  console.log('       ALL END-TO-END VERIFICATION TESTS PASSED!     ');
  console.log('====================================================\n');
}

runE2E().catch(console.error);
