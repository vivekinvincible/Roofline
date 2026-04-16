import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RooflineLayout from '@/components/RooflineLayout';
import { useRouter } from 'expo-router';

export default function SigninPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validate = () => {
    let newErrors: { [key: string]: string } = {};

    if (!form.fullName) newErrors.fullName = "Full name is required";
    
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Minimum 8 characters";
    }
    // We don't strictly need a max-length validation here anymore 
    // because the backend now truncates automatically, but it's good UX.
    if (form.password.length > 72) {
      newErrors.password = "Password is a bit too long";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // API call to the backend
      const response = await fetch('http://192.168.1.12:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          password: form.password, // CHANGED: Key matches UserCreate schema in backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Redirect to login
        router.push('/loginpage');
      } else {
        // Capture backend error messages (400, 422, or 500)
        let errorMsg = "Something went wrong";
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Handle Pydantic validation array errors
          errorMsg = data.detail[0].msg;
        }
        setErrors({ server: errorMsg });
      }
    } catch (err) {
      setErrors({ server: "Could not connect to the server. Check your network." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RooflineLayout>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.heading}>Create Account</Text>

          {errors.server && (
            <View style={styles.serverErrorContainer}>
               <Text style={styles.serverErrorText}>{errors.server}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Alex Ferren"
              value={form.fullName}
              onChangeText={(val) => setForm({ ...form, fullName: val })}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="name@company.com"
              value={form.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(val) => setForm({ ...form, email: val })}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              secureTextEntry
              maxLength={72} // Prevents going over bcrypt limit on the client side
              value={form.password}
              onChangeText={(val) => setForm({ ...form, password: val })}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="••••••••"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(val) => setForm({ ...form, confirmPassword: val })}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && { opacity: 0.7 }]} 
            onPress={handleSignUp} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Sign Up</Text>}
          </TouchableOpacity>

          <View style={styles.footerTextRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/loginpage')}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 12, padding: 24, elevation: 5 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#1F2937' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 16 },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  serverErrorContainer: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginBottom: 16 },
  serverErrorText: { color: '#B91C1C', textAlign: 'center', fontSize: 14 },
  loginButton: { backgroundColor: '#111827', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footerTextRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 13, color: '#6B7280' },
  signupLink: { fontSize: 13, color: '#6366F1', fontWeight: '600', marginLeft: 4 },
});