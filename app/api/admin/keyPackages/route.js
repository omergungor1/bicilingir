import { NextResponse } from "next/server";
import { checkAdminAuth } from '../../utils';


export async function GET(request) {
  const { supabase } = await checkAdminAuth(request);

  const { data: keyPackages, error } = await supabase
    .from('key_packages')
    .select('id, name, description, price, startdate, enddate, keyAmount, isUnlimited, isActive, createdAt')
    .order('keyAmount', { ascending: true });

  if (error) {
    throw error;
  }
  return NextResponse.json({ success: true, data: keyPackages });
}

export async function POST(request) {
  const { name, description, price, startdate, enddate, keyAmount, isUnlimited, isActive } = await request.json();
  const { supabase } = await checkAdminAuth(request);

  const insertData = {
    name,
    description,
    price,
    startdate: isUnlimited ? null : startdate,
    enddate: isUnlimited ? null : enddate,
    keyAmount,
    isUnlimited,
    isActive,
    createdAt: new Date()
  }

  const { data: keyPackage, error } = await supabase
    .from('key_packages')
    .insert(insertData);
    
  if (error) {
    throw error;
  }
  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  const { id, name, description, price, startdate, enddate, keyAmount, isUnlimited, isActive } = await request.json();
  const { supabase } = await checkAdminAuth(request);

  console.log(startdate, enddate);
  if (!id) {
    throw new Error('ID is required');
  }

  const updateData = {
    name,
    description,
    price,
    startdate: isUnlimited ? null : startdate,
    enddate: isUnlimited ? null : enddate,
    keyAmount,
    isUnlimited,
    isActive
  }

  const { data: keyPackage, error } = await supabase
    .from('key_packages')
    .update(updateData)
    .eq('id', id);

    console.log(keyPackage);

  if (error) {
    throw error;
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { supabase } = await checkAdminAuth(request);


  if (!id) {
    throw new Error('ID is required');
  }

  const { error } = await supabase
    .from('key_packages')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return NextResponse.json({ success: true });
}
